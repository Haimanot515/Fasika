const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* ───── HELPER: Supabase Image Upload ───── */
const uploadToSupabase = async (file, bucket, folder = 'listings') => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

/* ───── INTERNAL HELPER: Status Updater ───── */
// Maintains the 'DROP' naming logic for state changes
const setStatus = async (req, res, newStatus) => {
    try {
        const { listing_id } = req.params;
        const sellerInternalId = req.user.userInternalId; 

        const { rowCount } = await pool.query(
            "UPDATE marketplace_listings SET status = $1, updated_at = NOW() WHERE id = $2 AND seller_internal_id = $3",
            [newStatus, listing_id, sellerInternalId]
        );

        if (rowCount === 0) return res.status(404).json({ error: "Node not found in registry or unauthorized" });
        res.json({ success: true, message: `Registry DROP: Status updated to ${newStatus}` });
    } catch (err) {
        res.status(500).json({ error: "Authority: " + err.message });
    }
};

/* ───── EXPORTED FUNCTIONS ───── */

// 1. Create Listing Node
exports.createListing = async (req, res) => {
    try {
        const sellerInternalId = req.user.userInternalId;
        const { product_category, product_name, quantity, unit, price_per_unit, description } = req.body;

        // Uses the 'FarmerListing' bucket as per your previous schema setup
        const primaryImageUrl = await uploadToSupabase(req.files?.primary_image?.[0], 'FarmerListing');
        const galleryUrls = req.files?.gallery_images
            ? await Promise.all(req.files.gallery_images.map(f => uploadToSupabase(f, 'FarmerListing')))
            : [];

        const { rows } = await pool.query(
            `INSERT INTO marketplace_listings 
            (seller_internal_id, product_category, product_name, quantity, unit, price_per_unit, description, primary_image_url, gallery_urls, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE') RETURNING *`,
            [sellerInternalId, product_category.toUpperCase(), product_name, quantity, unit || 'KG', price_per_unit, description, primaryImageUrl, galleryUrls]
        );
        res.status(201).json({ success: true, message: "Registry DROP: Node Published", data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Get All Active/Paused Listings (Farmer's Personal Registry View)
exports.getFarmerListings = async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM marketplace_listings WHERE seller_internal_id = $1 AND status != 'ARCHIVED' ORDER BY created_at DESC",
            [req.user.userInternalId]
        );
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ error: "Registry Fetch Error" });
    }
};

// 3. Update Listing (PUT)
exports.updateListing = async (req, res) => {
    try {
        const { product_name, price_per_unit, quantity, status, unit, description } = req.body;
        const { rows } = await pool.query(
            `UPDATE marketplace_listings 
             SET product_name=COALESCE($1, product_name), price_per_unit=COALESCE($2, price_per_unit), 
                 quantity=COALESCE($3, quantity), status=COALESCE($4, status), 
                 unit=COALESCE($5, unit), description=COALESCE($6, description), updated_at=NOW()
             WHERE id=$7 AND seller_internal_id=$8 RETURNING *`,
            [product_name, price_per_unit, quantity, status, unit, description, req.params.listing_id, req.user.userInternalId]
        );
        
        if (!rows.length) return res.status(404).json({ error: "Registry Node not found" });
        res.json({ success: true, message: "Registry DROP: Update committed", data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "DROP: Failed to update node" });
    }
};

/* ───── STATE TOGGLES (PATCH) ───── */

exports.pauseListing = (req, res) => setStatus(req, res, 'PAUSED');

exports.resumeListing = (req, res) => setStatus(req, res, 'ACTIVE');

exports.archiveListing = (req, res) => setStatus(req, res, 'ARCHIVED');

exports.undoArchive = (req, res) => setStatus(req, res, 'ACTIVE');

/* ───── HARD DELETE ───── */

exports.deleteListing = async (req, res) => {
    try {
        const { rowCount } = await pool.query(
            "DELETE FROM marketplace_listings WHERE id = $1 AND seller_internal_id = $2",
            [req.params.listing_id, req.user.userInternalId]
        );
        if (rowCount === 0) return res.status(404).json({ error: "Node not found" });
        res.json({ success: true, message: "Registry Node permanently removed" });
    } catch (err) {
        res.status(500).json({ error: "Registry execution error" });
    }
};

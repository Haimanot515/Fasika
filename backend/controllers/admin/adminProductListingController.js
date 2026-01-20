const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* ───── HELPER: Supabase Image Upload ───── */
const uploadToSupabase = async (file, bucket = 'FarmerListing', folder = 'listings') => {
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

/* ───── AUTHORITY SEARCH (Registry Discovery) ───── */

// This function MUST be exported for your search button to work!
exports.searchFarmers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.status(200).json({ success: true, farmers: [] });
        }

        const searchVal = `%${query.toLowerCase()}%`;
        
        const result = await pool.query(
            `SELECT u.id, u.full_name, u.email, u.phone, f.farm_name 
             FROM users u
             INNER JOIN farmers f ON u.id = f.user_internal_id
             WHERE (LOWER(u.full_name) LIKE $1 OR LOWER(f.farm_name) LIKE $1 OR u.phone LIKE $1)
             AND u.role = 'FARMER' 
             LIMIT 15`,
            [searchVal]
        );

        res.status(200).json({ success: true, farmers: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "DROP: Search logic failed" });
    }
};

/* ───── REGISTRY READ OPERATIONS ───── */

exports.getAllListings = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT ml.*, u.full_name as owner_name, f.farm_name 
             FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id
             LEFT JOIN farmers f ON u.id = f.user_internal_id
             ORDER BY ml.created_at DESC`
        );
        res.json({ success: true, listings: rows });
    } catch (err) {
        res.status(500).json({ error: "Registry Fetch Error" });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM marketplace_listings WHERE id = $1", 
            [req.params.listing_id]
        );
        if (!rows.length) return res.status(404).json({ error: "Node not found" });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Authority: " + err.message });
    }
};

/* ───── AUTHORITY WRITE OPERATIONS (DROP) ───── */

exports.adminCreateListing = async (req, res) => {
    try {
        const { seller_internal_id, product_category, product_name, quantity, unit, price_per_unit, description } = req.body;

        const primaryImageUrl = await uploadToSupabase(req.files?.primary_image?.[0]);
        const galleryUrls = req.files?.gallery_images
            ? await Promise.all(req.files.gallery_images.map(f => uploadToSupabase(f)))
            : [];

        const { rows } = await pool.query(
            `INSERT INTO marketplace_listings 
            (seller_internal_id, product_category, product_name, quantity, unit, price_per_unit, description, primary_image_url, gallery_urls, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE') RETURNING *`,
            [seller_internal_id, product_category, product_name, quantity, unit || 'KG', price_per_unit, description, primaryImageUrl, galleryUrls]
        );
        res.status(201).json({ success: true, message: "REGISTRY DROP: Node Created", data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "DROP failure: " + err.message });
    }
};

exports.adminUpdateListing = async (req, res) => {
    try {
        const { product_name, price_per_unit, quantity, status, unit, description } = req.body;
        const { rows } = await pool.query(
            `UPDATE marketplace_listings 
             SET product_name=COALESCE($1, product_name), price_per_unit=COALESCE($2, price_per_unit), 
                 quantity=COALESCE($3, quantity), status=COALESCE($4, status), 
                 unit=COALESCE($5, unit), description=COALESCE($6, description), updated_at=NOW()
             WHERE id=$7 RETURNING *`,
            [product_name, price_per_unit, quantity, status, unit, description, req.params.listing_id]
        );
        res.json({ success: true, message: "REGISTRY DROP: Update committed", data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "DROP update failed" });
    }
};

exports.adminArchiveListing = async (req, res) => {
    try {
        await pool.query(
            "UPDATE marketplace_listings SET status = 'ARCHIVED', updated_at = NOW() WHERE id = $1", 
            [req.params.listing_id]
        );
        res.json({ success: true, message: "REGISTRY DROP: Node Archived" });
    } catch (err) {
        res.status(500).json({ error: "DROP archive failure" });
    }
};

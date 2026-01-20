const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* =========================
   Helper: Supabase Upload
========================= */
const uploadToSupabase = async (file, folder = 'marketplace') => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('FarmerListing')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    const { data: urlData } = supabase.storage
        .from('FarmerListing')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
};

/* =========================
   1. CRUD OPERATIONS
========================= */

// Create a new listing
exports.createListing = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const fields = req.body;

        const primary_image_url = req.files?.primary_image 
            ? await uploadToSupabase(req.files.primary_image[0], 'products') 
            : null;

        const gallery_urls = req.files?.gallery_images 
            ? await Promise.all(req.files.gallery_images.map(f => uploadToSupabase(f, 'gallery'))) 
            : [];

        const result = await pool.query(
            `INSERT INTO marketplace_listings (
                seller_id, product_category, product_name, variety_or_breed,
                quantity, unit, price_per_unit, primary_image_url, gallery_urls, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE') RETURNING listing_id`,
            [userId, fields.product_category, fields.product_name, fields.variety_or_breed,
             fields.quantity, fields.unit, fields.price_per_unit, primary_image_url, gallery_urls]
        );

        res.status(201).json({ success: true, message: "Registry Node DROPPED", listing_id: result.rows[0].listing_id });
    } catch (err) {
        res.status(500).json({ error: "Authority: Failed to create listing" });
    }
};

// Get all for dashboard (Excludes ARCHIVED by default)
exports.getFarmerListings = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT * FROM marketplace_listings WHERE seller_id = $1 AND status != 'ARCHIVED' ORDER BY created_at DESC`,
            [userId]
        );
        res.json({ success: true, listings: result.rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Get single listing for Edit Page
exports.getFarmerListingById = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT * FROM marketplace_listings WHERE listing_id = $1 AND seller_id = $2`,
            [listing_id, userId]
        );
        if (!result.rowCount) return res.status(404).json({ error: "Node not found" });
        res.json({ success: true, listing: result.rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Update Listing
exports.updateListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const userId = req.user.userInternalId;
        const fields = { ...req.body };

        if (req.files?.primary_image) {
            fields.primary_image_url = await uploadToSupabase(req.files.primary_image[0], 'products');
        }

        const keys = Object.keys(fields).filter(k => k !== 'listing_id');
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = [...keys.map(k => fields[k]), listing_id, userId];

        await pool.query(
            `UPDATE marketplace_listings SET ${setClause}, updated_at = NOW() 
             WHERE listing_id = $${keys.length + 1} AND seller_id = $${keys.length + 2}`,
            values
        );
        res.json({ success: true, message: "Registry Node UPDATED" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

/* =========================
   2. STATE MANAGEMENT
========================= */

exports.pauseListing = (req, res) => changeStatus(req, res, 'PAUSED');
exports.resumeListing = (req, res) => changeStatus(req, res, 'ACTIVE');
exports.archiveListing = (req, res) => changeStatus(req, res, 'ARCHIVED');
exports.undoArchive = (req, res) => changeStatus(req, res, 'ACTIVE');

async function changeStatus(req, res, status) {
    try {
        const { listing_id } = req.params;
        const userId = req.user.userInternalId;
        await pool.query(
            `UPDATE marketplace_listings SET status = $1 WHERE listing_id = $2 AND seller_id = $3`,
            [status, listing_id, userId]
        );
        res.json({ success: true, message: `Status changed to ${status}` });
    } catch (err) { res.status(500).json({ error: err.message }); }
}

/* =========================
   3. PERMANENT DELETION
========================= */

exports.deleteListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const userId = req.user.userInternalId;
        await pool.query(
            `DELETE FROM marketplace_listings WHERE listing_id = $1 AND seller_id = $2`,
            [listing_id, userId]
        );
        res.json({ success: true, message: "Registry Node DROPPED permanently" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

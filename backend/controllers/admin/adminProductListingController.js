const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* =========================
   Helper: Upload to Supabase
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
    const { data: urlData } = supabase.storage.from('FarmerListing').getPublicUrl(filePath);
    return urlData.publicUrl;
};

/* =========================
   1️⃣ Get all listings (Global or Farmer-Specific)
   Sync: Uses seller_internal_id and joins with users table
========================= */
const getAllListings = async (req, res) => {
    try {
        const { status, category, sellerId, limit = 20, offset = 0 } = req.query;

        const conditions = [];
        const values = [];
        let counter = 1;

        if (status) { conditions.push(`ml.status = $${counter++}`); values.push(status.toUpperCase()); }
        if (category) { conditions.push(`ml.product_category = $${counter++}`); values.push(category); }
        
        // Matches schema: seller_internal_id
        if (sellerId) { 
            conditions.push(`ml.seller_internal_id = $${counter++}`); 
            values.push(sellerId); 
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const result = await pool.query(
            `SELECT 
                ml.*, 
                ml.id AS listing_id, 
                u.full_name AS owner_name, 
                f.farm_name,
                f.farm_type
             FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id
             LEFT JOIN farmers f ON u.id = f.user_internal_id
             ${whereClause}
             ORDER BY ml.created_at DESC
             LIMIT $${counter++} OFFSET $${counter}`,
            [...values, limit, offset]
        );

        res.status(200).json({ 
            success: true, 
            count: result.rowCount, 
            message: "Registry DROP Fetched Successfully", 
            listings: result.rows 
        });
    } catch (err) {
        console.error('Registry Fetch Error:', err);
        res.status(500).json({ success: false, message: 'Authority: Server error during registry fetch' });
    }
};

/* =========================
   2️⃣ Get single listing (Node Detail)
========================= */
const getListingById = async (req, res) => {
    try {
        const { listing_id } = req.params; // Corresponds to 'id' in schema
        const result = await pool.query(
            `SELECT ml.*, ml.id AS listing_id, u.full_name as owner_name, f.farm_name 
             FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id
             LEFT JOIN farmers f ON u.id = f.user_internal_id
             WHERE ml.id = $1`,
            [listing_id]
        );

        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Node not found in registry' });
        res.json({ success: true, listing: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registry connection error' });
    }
};

/* =========================
   3️⃣ Create listing (Authority Action)
========================= */
const adminCreateListing = async (req, res) => {
    try {
        const fields = req.body;
        
        // Media Processing
        const primary_image_url = req.files?.primary_image
            ? await uploadToSupabase(req.files.primary_image[0], 'marketplace/images')
            : null;

        const gallery_urls = req.files?.gallery_images
            ? await Promise.all(req.files.gallery_images.map(f => uploadToSupabase(f, 'marketplace/images')))
            : [];

        const result = await pool.query(
            `INSERT INTO marketplace_listings (
                seller_internal_id, product_category, product_name, description,
                quantity, unit, price_per_unit, primary_image_url, gallery_urls, status
            ) VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            ) RETURNING id AS listing_id`,
            [
                fields.seller_internal_id, fields.product_category, fields.product_name, fields.description,
                fields.quantity, fields.unit || 'KG', fields.price_per_unit, 
                primary_image_url, gallery_urls, fields.status || 'ACTIVE'
            ]
        );

        res.status(201).json({ success: true, message: 'Registry Node Created', listing_id: result.rows[0].listing_id });
    } catch (err) {
        console.error("Create Error:", err.message);
        res.status(500).json({ message: 'DROP: Failed to create listing node' });
    }
};

/* =========================
   4️⃣ Update listing (Authority Action)
========================= */
const adminUpdateListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const fields = { ...req.body };

        if (req.files?.primary_image) {
            fields.primary_image_url = await uploadToSupabase(req.files.primary_image[0], 'marketplace/images');
        }

        const keys = Object.keys(fields);
        if (!keys.length) return res.status(400).json({ message: 'No fields provided for update' });

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = keys.map(k => fields[k]);
        values.push(listing_id);

        const result = await pool.query(
            `UPDATE marketplace_listings SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING id AS listing_id`,
            values
        );

        res.json({ success: true, message: 'Registry DROP: Node updated', listing_id: result.rows[0].listing_id });
    } catch (err) {
        res.status(500).json({ message: 'Failed to commit DROP update' });
    }
};

/* =========================
   5️⃣ Admin Actions (DROP / Archive)
========================= */
const adminArchiveListing = (req, res) => adminChangeStatus(req, res, 'ARCHIVED', 'DROP_LISTING');

async function adminChangeStatus(req, res, status, action) {
    try {
        const { listing_id } = req.params;
        const admin_id = req.user.id; // Admin performing the action

        const result = await pool.query(
            `UPDATE marketplace_listings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
            [status, listing_id]
        );

        if (!result.rowCount) return res.status(404).json({ message: 'Node not found' });

        // Audit the DROP action
        await pool.query(
            `INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id) VALUES ($1,$2,'LISTING',$3)`,
            [admin_id, action, listing_id]
        );

        res.json({ success: true, message: `Registry DROP: ${action} Successful`, listing_id });
    } catch (err) {
        res.status(500).json({ message: `Authority failed to execute DROP action` });
    }
}

module.exports = {
    getAllListings,
    getListingById,
    adminCreateListing,
    adminUpdateListing,
    adminArchiveListing
};

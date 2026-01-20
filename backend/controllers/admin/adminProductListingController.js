
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
   NEW: Search Farmers for Linking
   Used by the frontend search bar
========================= */
const searchFarmers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 3) {
            return res.status(200).json({ success: true, farmers: [] });
        }

        const searchVal = `%${query.toLowerCase()}%`;
        const result = await pool.query(
            `SELECT id, full_name, email, phone 
             FROM users 
             WHERE (LOWER(full_name) LIKE $1 OR LOWER(email) LIKE $1 OR phone LIKE $1) 
             AND role = 'FARMER' 
             LIMIT 10`,
            [searchVal]
        );

        res.status(200).json({ success: true, farmers: result.rows });
    } catch (err) {
        console.error('Farmer Search Error:', err);
        res.status(500).json({ success: false, message: 'Authority: Search failed' });
    }
};

/* =========================
   1️⃣ Get all listings (Enhanced Search)
========================= */
const getAllListings = async (req, res) => {
    try {
        const { status, category, sellerId, search, limit = 50, offset = 0 } = req.query;
        const conditions = [];
        const values = [];
        let counter = 1;

        if (status) { 
            conditions.push(`ml.status = $${counter++}`); 
            values.push(status.toUpperCase()); 
        }
        if (category) { 
            conditions.push(`ml.product_category = $${counter++}`); 
            values.push(category.toUpperCase()); 
        }
        if (sellerId) { 
            conditions.push(`ml.seller_internal_id = $${counter++}`); 
            values.push(sellerId); 
        }

        if (search) {
            const searchVal = `%${search.toLowerCase()}%`;
            conditions.push(`(
                LOWER(ml.product_name) LIKE $${counter} OR 
                LOWER(u.full_name) LIKE $${counter} OR 
                LOWER(u.email) LIKE $${counter} OR 
                u.phone LIKE $${counter}
            )`);
            values.push(searchVal);
            counter++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
            SELECT 
                ml.*, 
                ml.id AS listing_id, 
                u.full_name AS owner_name, 
                u.email AS owner_email,
                u.phone AS owner_phone
             FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id
             ${whereClause}
             ORDER BY ml.created_at DESC
             LIMIT $${counter++} OFFSET $${counter}
        `;

        const result = await pool.query(query, [...values, limit, offset]);
        res.status(200).json({ success: true, message: "Registry DROP Fetched", listings: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Authority: Registry fetch error' });
    }
};

/* =========================
   2️⃣ Get single listing (Node Detail)
   Crucial: Provides owner details for initial form load
========================= */
const getListingById = async (req, res) => {
    try {
        const { listing_id } = req.params; 
        const result = await pool.query(
            `SELECT 
                ml.*, 
                ml.id AS listing_id, 
                u.full_name as owner_name, 
                u.email as owner_email,
                u.phone as owner_phone
             FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id
             WHERE ml.id = $1`,
            [listing_id]
        );

        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Node not found' });
        res.json({ success: true, listing: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registry connection error' });
    }
};

/* =========================
   4️⃣ Update listing (Authority Action)
========================= */
const adminUpdateListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const fields = { ...req.body };

        // 1. Handle primary image upload if provided
        if (req.files?.primary_image) {
            fields.primary_image_url = await uploadToSupabase(req.files.primary_image[0], 'marketplace/images');
        }

        // 2. Remove keys that shouldn't be updated manually or are metadata
        delete fields.listing_id;
        delete fields.owner_name;
        delete fields.owner_email;
        delete fields.owner_phone;

        const keys = Object.keys(fields);
        if (!keys.length) return res.status(400).json({ message: 'No fields provided for update' });

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = keys.map(k => fields[k]);
        values.push(listing_id);

        const result = await pool.query(
            `UPDATE marketplace_listings 
             SET ${setClause}, updated_at = NOW() 
             WHERE id = $${values.length} 
             RETURNING id AS listing_id`,
            values
        );

        res.json({ success: true, message: 'Registry DROP: Node updated', listing_id: result.rows[0].listing_id });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: 'Failed to commit DROP update' });
    }
};

// ... (Create and Archive functions remain same)

module.exports = {
    searchFarmers, // Exporting new search function
    getAllListings,
    getListingById,
    adminCreateListing,
    adminUpdateListing,
    adminArchiveListing
};

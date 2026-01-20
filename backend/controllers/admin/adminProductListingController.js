const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* =========================
   1️⃣ THE SEARCH LOGIC (Farmers)
   This is what makes your Search Button work.
   It scans Full Name, Phone, Email, and Farm Name.
========================= */
const searchFarmers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res.status(200).json({ success: true, farmers: [] });
        }

        const searchVal = `%${query.toLowerCase()}%`;
        
        // Joining users (for contact info) with farmers (for farm name)
        const result = await pool.query(
            `SELECT 
                u.id, 
                u.full_name, 
                u.email, 
                u.phone, 
                f.farm_name 
             FROM users u
             LEFT JOIN farmers f ON u.id = f.user_internal_id
             WHERE (
                LOWER(u.full_name) LIKE $1 OR 
                LOWER(u.email) LIKE $1 OR 
                u.phone LIKE $1 OR 
                LOWER(f.farm_name) LIKE $1
             ) 
             AND u.role = 'FARMER' 
             LIMIT 15`,
            [searchVal]
        );

        res.status(200).json({ success: true, farmers: result.rows });
    } catch (err) {
        console.error('Search Error:', err);
        res.status(500).json({ success: false, message: 'Authority: Registry search failed' });
    }
};

/* =========================
   2️⃣ Get Single Listing (For Edit Load)
========================= */
const getListingById = async (req, res) => {
    try {
        const { listing_id } = req.params; 
        const result = await pool.query(
            `SELECT 
                ml.*, 
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
        res.status(500).json({ success: false, message: 'Registry fetch error' });
    }
};

/* =========================
   3️⃣ Create Listing Node
========================= */
const adminCreateListing = async (req, res) => {
    try {
        const f = req.body;
        const result = await pool.query(
            `INSERT INTO marketplace_listings (
                seller_internal_id, product_category, product_name, description,
                quantity, unit, price_per_unit, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [f.seller_internal_id, f.product_category, f.product_name, f.description, 
             f.quantity, f.unit || 'KG', f.price_per_unit, f.status || 'ACTIVE']
        );
        res.status(201).json({ success: true, message: 'Registry Node Created', listing_id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: 'DROP: Failed to create listing node' });
    }
};

/* =========================
   4️⃣ Update Listing Node
========================= */
const adminUpdateListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const fields = { ...req.body };

        // Clean frontend display-only fields
        delete fields.owner_name;
        delete fields.owner_email;
        delete fields.owner_phone;

        const keys = Object.keys(fields);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = [...keys.map(k => fields[k]), listing_id];

        const result = await pool.query(
            `UPDATE marketplace_listings SET ${setClause}, updated_at = NOW() 
             WHERE id = $${values.length} RETURNING id`,
            values
        );

        res.json({ success: true, message: 'Registry DROP: Node updated', listing_id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: 'Failed to commit DROP update' });
    }
};

/* =========================
   5️⃣ Get All Listings
========================= */
const getAllListings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ml.*, u.full_name as owner_name FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id ORDER BY ml.created_at DESC`
        );
        res.json({ success: true, listings: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetch error' });
    }
};

module.exports = {
    searchFarmers,
    getListingById,
    adminCreateListing,
    adminUpdateListing,
    getAllListings
};

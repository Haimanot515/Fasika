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
   1️⃣ Search Farmers (For Linking)
========================= */
const searchFarmers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 3) return res.status(200).json({ success: true, farmers: [] });

        const searchVal = `%${query.toLowerCase()}%`;
        const result = await pool.query(
            `SELECT id, full_name, email, phone FROM users 
             WHERE (LOWER(full_name) LIKE $1 OR LOWER(email) LIKE $1 OR phone LIKE $1) 
             AND role = 'FARMER' LIMIT 10`,
            [searchVal]
        );
        res.status(200).json({ success: true, farmers: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Authority: Search error' });
    }
};

/* =========================
   2️⃣ Get All Listings
========================= */
const getAllListings = async (req, res) => {
    try {
        const { status, category, sellerId, search, limit = 50, offset = 0 } = req.query;
        const conditions = [];
        const values = [];
        let counter = 1;

        if (status) { conditions.push(`ml.status = $${counter++}`); values.push(status.toUpperCase()); }
        if (category) { conditions.push(`ml.product_category = $${counter++}`); values.push(category.toUpperCase()); }
        if (sellerId) { conditions.push(`ml.seller_internal_id = $${counter++}`); values.push(sellerId); }

        if (search) {
            const searchVal = `%${search.toLowerCase()}%`;
            conditions.push(`(LOWER(ml.product_name) LIKE $${counter} OR LOWER(u.full_name) LIKE $${counter})`);
            values.push(searchVal);
            counter++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
            SELECT ml.*, u.full_name AS owner_name, u.email AS owner_email, u.phone AS owner_phone
            FROM marketplace_listings ml
            JOIN users u ON ml.seller_internal_id = u.id
            ${whereClause}
            ORDER BY ml.created_at DESC LIMIT $${counter++} OFFSET $${counter}
        `;
        const result = await pool.query(query, [...values, limit, offset]);
        res.status(200).json({ success: true, listings: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registry fetch error' });
    }
};

/* =========================
   3️⃣ Get Listing By ID
========================= */
const getListingById = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const result = await pool.query(
            `SELECT ml.*, u.full_name as owner_name, u.email as owner_email, u.phone as owner_phone
             FROM marketplace_listings ml
             JOIN users u ON ml.seller_internal_id = u.id
             WHERE ml.id = $1`, [listing_id]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Node not found' });
        res.json({ success: true, listing: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registry connection error' });
    }
};

/* =========================
   4️⃣ Create Listing
========================= */
const adminCreateListing = async (req, res) => {
    try {
        const fields = req.body;
        const primary_image_url = req.files?.primary_image 
            ? await uploadToSupabase(req.files.primary_image[0], 'marketplace/images') 
            : null;

        const result = await pool.query(
            `INSERT INTO marketplace_listings (
                seller_internal_id, product_category, product_name, description,
                quantity, unit, price_per_unit, primary_image_url, status
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
            [
                fields.seller_internal_id, fields.product_category, fields.product_name, 
                fields.description, fields.quantity, fields.unit || 'KG', 
                fields.price_per_unit, primary_image_url, fields.status || 'ACTIVE'
            ]
        );
        res.status(201).json({ success: true, message: 'Registry Node Created', listing_id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: 'DROP: Failed to create listing' });
    }
};

/* =========================
   5️⃣ Update Listing
========================= */
const adminUpdateListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const fields = { ...req.body };

        if (req.files?.primary_image) {
            fields.primary_image_url = await uploadToSupabase(req.files.primary_image[0], 'marketplace/images');
        }

        // Clean up metadata keys before DB update
        delete fields.owner_name; delete fields.owner_email; delete fields.owner_phone;

        const keys = Object.keys(fields);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = keys.map(k => fields[k]);
        values.push(listing_id);

        const result = await pool.query(
            `UPDATE marketplace_listings SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING id`,
            values
        );
        res.json({ success: true, message: 'Registry DROP: Node updated', listing_id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: 'Failed to commit DROP update' });
    }
};

/* =========================
   6️⃣ Archive (DROP) Listing
========================= */
const adminArchiveListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        await pool.query(`UPDATE marketplace_listings SET status = 'ARCHIVED', updated_at = NOW() WHERE id = $1`, [listing_id]);
        res.json({ success: true, message: 'Registry DROP: Node Archived' });
    } catch (err) {
        res.status(500).json({ message: 'Archive failed' });
    }
};

module.exports = {
    searchFarmers,
    getAllListings,
    getListingById,
    adminCreateListing,
    adminUpdateListing,
    adminArchiveListing
};

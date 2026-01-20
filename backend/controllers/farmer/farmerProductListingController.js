const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/**
 * Helper: Supabase Buffer Upload
 * Bucket: 'FarmerListing' (using your consistent bucket)
 */
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

// 1️⃣ CREATE PRODUCT LISTING (Farmer Side)
exports.createListing = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const fields = req.body;

        // Process images from memory buffer
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
            [
                userId, fields.product_category, fields.product_name, fields.variety_or_breed,
                fields.quantity, fields.unit, fields.price_per_unit, 
                primary_image_url, gallery_urls
            ]
        );

        res.status(201).json({ 
            success: true, 
            message: "Marketplace Node DROPPED successfully", 
            listing_id: result.rows[0].listing_id 
        });
    } catch (err) {
        console.error("Listing Error:", err.message);
        res.status(500).json({ error: "Failed to DROP listing to registry" });
    }
};

// 2️⃣ GET FARMER'S OWN LISTINGS
exports.getMyListings = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT * FROM marketplace_listings WHERE seller_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.json({ success: true, listings: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3️⃣ UPDATE LISTING (Farmer Side)
exports.updateListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const userId = req.user.userInternalId;
        const fields = { ...req.body };

        if (req.files?.primary_image) {
            fields.primary_image_url = await uploadToSupabase(req.files.primary_image[0], 'products');
        }

        const keys = Object.keys(fields);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = [...keys.map(k => fields[k]), listing_id, userId];

        await pool.query(
            `UPDATE marketplace_listings SET ${setClause}, updated_at = NOW() 
             WHERE listing_id = $${keys.length + 1} AND seller_id = $${keys.length + 2}`,
            values
        );

        res.json({ success: true, message: "Registry Node UPDATED" });
    } catch (err) {
        res.status(500).json({ error: "Update Authority Failed" });
    }
};

// 4️⃣ DELETE / DROP LISTING
exports.deleteListing = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const userId = req.user.userInternalId;
        
        await pool.query(
            `DELETE FROM marketplace_listings WHERE listing_id = $1 AND seller_id = $2`,
            [listing_id, userId]
        );
        
        res.json({ success: true, message: "Listing Node DROPPED from registry" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5️⃣ TOGGLE STATUS (Pause/Resume)
exports.toggleListingStatus = async (req, res) => {
    try {
        const { listing_id } = req.params;
        const { status } = req.body; // Expecting 'ACTIVE' or 'PAUSED'
        const userId = req.user.userInternalId;

        await pool.query(
            `UPDATE marketplace_listings SET status = $1 WHERE listing_id = $2 AND seller_id = $3`,
            [status, listing_id, userId]
        );

        res.json({ success: true, message: `Listing status changed to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

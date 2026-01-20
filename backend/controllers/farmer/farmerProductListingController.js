const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/* =========================
   Helper: Supabase Buffer Upload
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
   1️⃣ Get all listings (FIXED SQL)
========================= */
const getAllListings = async (req, res) => {
    try {
        const { status, category, limit = 20, offset = 0 } = req.query;
        const values = [];
        let counter = 1;
        let whereClause = '';

        if (status) {
            whereClause = `WHERE ml.status = $${counter++}`;
            values.push(status.toUpperCase());
        }

        // Logic fix: Ensure limit and offset are the LAST parameters
        const query = `
            SELECT 
                ml.*, 
                u.full_name AS owner_name, 
                f.farm_name
            FROM marketplace_listings ml
            JOIN farmers f ON ml.seller_id = f.user_internal_id
            JOIN users u ON f.user_internal_id = u.id
            ${whereClause}
            ORDER BY ml.created_at DESC
            LIMIT $${counter++} OFFSET $${counter++}`;
        
        // We push limit and offset at the end to match the counter
        const finalValues = [...values, parseInt(limit), parseInt(offset)];
        
        const result = await pool.query(query, finalValues);

        res.status(200).json({ 
            success: true, 
            message: "Registry DROP Synchronized",
            listings: result.rows 
        });
    } catch (err) {
        console.error('REGISTRY FETCH ERROR:', err.message);
        res.status(500).json({ success: false, message: "DROP: Database internal error" });
    }
};

// 2. Placeholder exports to satisfy line 87 of your routes
module.exports = {
    getAllListings,
    getListingById: async (req, res) => { res.json({success: true}) },
    adminCreateListing: async (req, res) => { res.json({success: true}) },
    adminUpdateListing: async (req, res) => { res.json({success: true}) },
    adminPauseListing: async (req, res) => { res.json({success: true}) },
    adminArchiveListing: async (req, res) => { res.json({success: true}) },
    adminUndoArchive: async (req, res) => { res.json({success: true}) },
    boostListing: async (req, res) => { res.json({success: true}) },
    markListingSold: async (req, res) => { res.json({success: true}) }
};


const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

// --- Helper: Supabase Image Upload ---
const uploadToSupabase = async (file, bucket = 'FarmerProfiles') => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `profiles/${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

// 1. CREATE: Initial Farmer Profile Onboarding
exports.createFarmerProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id; // From your authenticate middleware
        const { farm_name, farm_type, public_farmer_id, plot_name, area_size, tag_number, species } = req.body;

        await client.query('BEGIN');

        // Photo logic
        let photoUrl = null;
        if (req.file) photoUrl = await uploadToSupabase(req.file);

        if (photoUrl) {
            await client.query("UPDATE users SET photo_url = $1 WHERE id = $2", [photoUrl, userId]);
        }

        const farmerRes = await client.query(
            `INSERT INTO farmers (user_internal_id, farm_name, farm_type, public_farmer_id)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [userId, farm_name, farm_type, public_farmer_id]
        );
        const farmerId = farmerRes.rows[0].id;

        await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size) VALUES ($1, $2, $3)`,
            [farmerId, plot_name, area_size]
        );

        if (tag_number) {
            await client.query(
                `INSERT INTO animals (user_internal_id, tag_number, species) VALUES ($1, $2, $3)`,
                [userId, tag_number, species]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: "Farmer Profile Created" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// 2. GET: Retrieve Full Unified Profile
exports.getFarmerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT u.*, f.farm_name, f.farm_type, f.public_farmer_id,
                (SELECT json_agg(lp) FROM land_plots lp WHERE lp.farmer_id = f.id) as plots,
                (SELECT json_agg(a) FROM animals a WHERE a.user_internal_id = u.id) as animals
            FROM users u
            LEFT JOIN farmers f ON u.id = f.user_internal_id
            WHERE u.id = $1`;
        
        const { rows } = await pool.query(query, [userId]);
        if (!rows.length) return res.status(404).json({ error: "Profile not found" });
        
        delete rows[0].password_hash; // Security
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPDATE: Sync Profile Changes
exports.updateFarmerProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { full_name, region, zone, woreda, kebele, farm_name, farm_type, plot_name, area_size, tag_number, species } = req.body;

        await client.query('BEGIN');

        let photoUrl = req.body.photo_url;
        if (req.file) photoUrl = await uploadToSupabase(req.file);

        // Update User
        await client.query(
            `UPDATE users SET full_name=COALESCE($1, full_name), region=$2, zone=$3, woreda=$4, kebele=$5, photo_url=COALESCE($6, photo_url) 
             WHERE id=$7`,
            [full_name, region, zone, woreda, kebele, photoUrl, userId]
        );

        // Update Farmer & Assets
        const fRes = await client.query(
            `UPDATE farmers SET farm_name=$1, farm_type=$2 WHERE user_internal_id=$3 RETURNING id`,
            [farm_name, farm_type, userId]
        );

        if (fRes.rows.length > 0) {
            await client.query(`UPDATE land_plots SET plot_name=$1, area_size=$2 WHERE farmer_id=$3`, 
            [plot_name, area_size, fRes.rows[0].id]);
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Farmer Profile Updated" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

const pool = require('../../config/dbConfig');
const { uploadToSupabase } = require('../../middleware/upload');

// 1. Create Profile
exports.createFarmerProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { full_name, farm_name, location } = req.body;
        const result = await pool.query(
            "INSERT INTO farmer_profiles (user_id, full_name, farm_name, location) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, full_name, farm_name, location]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Get Profile
exports.getFarmerProfile = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM farmer_profiles WHERE user_id = $1", [req.user.userId]);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Update Profile
exports.updateFarmerProfile = async (req, res) => {
    try {
        const { full_name, farm_name, location } = req.body;
        const result = await pool.query(
            "UPDATE farmer_profiles SET full_name = $1, farm_name = $2, location = $3 WHERE user_id = $4 RETURNING *",
            [full_name, farm_name, location, req.user.userId]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Upload Profile Image (This fixes the Line 25 crash)
exports.uploadFarmerProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image provided' });

        // Use our Supabase helper
        const imageUrl = await uploadToSupabase(req.file, 'farmer-assets', 'profiles');

        await pool.query(
            "UPDATE farmer_profiles SET profile_image_url = $1 WHERE user_id = $2",
            [imageUrl, req.user.userId]
        );

        res.json({ success: true, profile_image_url: imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
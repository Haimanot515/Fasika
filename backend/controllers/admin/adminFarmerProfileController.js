// controllers/adminFarmerProfileController.js
const pool = require('../../config/dbConfig');
const { uploadToCloudinary } = require('../../config/supabase'); // cloudinary config

/**
 * ==============================
 * Admin Farmer Profile Management
 * ==============================
 */

/**
 * Upload profile image for any farmer
 */
const uploadFarmerProfileImageAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const imageUrl = await uploadToCloudinary(req.file.buffer, 'farmer_profiles');

    const { rowCount } = await pool.query(
      `UPDATE farmer_profiles
       SET profile_image_url = $1,
           updated_at = NOW()
       WHERE user_id = $2`,
      [imageUrl, userId]
    );

    if (!rowCount) return res.status(404).json({ message: 'Farmer profile not found' });

    res.json({ message: 'Profile image uploaded successfully', profile_image_url: imageUrl });
  } catch (error) {
    console.error('uploadFarmerProfileImageAdmin error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

/**
 * Create farmer profile for any user
 */
const createFarmerProfileAdmin = async (req, res) => {
  try {
    const { userId, username, profile_image_url, gender, date_of_birth, preferred_language, farm_experience_years } = req.body;

    if (!userId || !username) return res.status(400).json({ message: 'userId and username are required' });

    const { rows } = await pool.query(
      `INSERT INTO farmer_profiles (
        farmer_profile_id,
        user_id,
        username,
        profile_image_url,
        gender,
        date_of_birth,
        preferred_language,
        farm_experience_years
      )
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [userId, username, profile_image_url || null, gender || null, date_of_birth || null, preferred_language || null, farm_experience_years || null]
    );

    res.status(201).json({ message: 'Farmer profile created successfully', profile: rows[0] });
  } catch (error) {
    console.error('createFarmerProfileAdmin error:', error);
    if (error.code === '23505') return res.status(409).json({ message: 'Farmer profile already exists' });
    res.status(500).json({ message: 'Failed to create farmer profile' });
  }
};

/**
 * Get any farmer profile
 */
const getFarmerProfileAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM farmer_profiles WHERE user_id = $1`,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ message: 'Farmer profile not found' });

    res.json({ success: true, profile: rows[0] });
  } catch (error) {
    console.error('getFarmerProfileAdmin error:', error);
    res.status(500).json({ message: 'Failed to fetch farmer profile' });
  }
};

/**
 * Update any farmer profile
 */
const updateFarmerProfileAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, profile_image_url, gender, date_of_birth, preferred_language, farm_experience_years } = req.body;

    const { rowCount } = await pool.query(
      `UPDATE farmer_profiles
       SET
         username = COALESCE($1, username),
         profile_image_url = COALESCE($2, profile_image_url),
         gender = COALESCE($3, gender),
         date_of_birth = COALESCE($4, date_of_birth),
         preferred_language = COALESCE($5, preferred_language),
         farm_experience_years = COALESCE($6, farm_experience_years),
         updated_at = NOW()
       WHERE user_id = $7`,
      [username, profile_image_url, gender, date_of_birth, preferred_language, farm_experience_years, userId]
    );

    if (!rowCount) return res.status(404).json({ message: 'Farmer profile not found' });

    res.json({ message: 'Farmer profile updated successfully' });
  } catch (error) {
    console.error('updateFarmerProfileAdmin error:', error);
    res.status(500).json({ message: 'Failed to update farmer profile' });
  }
};

/**
 * Delete any farmer profile
 */
const deleteFarmerProfileAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const { rowCount, rows } = await pool.query(
      `DELETE FROM farmer_profiles WHERE user_id=$1 RETURNING *`,
      [userId]
    );

    if (!rowCount) return res.status(404).json({ message: 'Farmer profile not found' });

    res.json({ message: 'Farmer profile deleted successfully', profile: rows[0] });
  } catch (error) {
    console.error('deleteFarmerProfileAdmin error:', error);
    res.status(500).json({ message: 'Failed to delete farmer profile' });
  }
};

module.exports = {
  uploadFarmerProfileImageAdmin,
  createFarmerProfileAdmin,
  getFarmerProfileAdmin,
  updateFarmerProfileAdmin,
  deleteFarmerProfileAdmin
};

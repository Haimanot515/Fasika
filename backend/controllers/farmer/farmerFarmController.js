const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/** * HELPER: Supabase Image Upload
 * BUCKET: 'FarmerListing'
 */
const uploadToSupabase = async (file, bucket = 'FarmerListing') => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `land_registry/${fileName}`; 

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

// 1. CREATE: Register Land (The "DROP" into Registry)
exports.registerLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.userInternalId; 
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele } = req.body;

        await client.query('BEGIN');

        // A. Image Upload
        let landImageUrl = null;
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        // B. Soil Lookup (Get ID from the soils registry)
        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;

        // C. Get Farmer ID
        const farmerRes = await client.query(`SELECT id FROM farmers WHERE user_internal_id = $1`, [userId]);
        const farmerId = farmerRes.rows[0].id;

        // D. INSERT Plot
        const result = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size, soil_id, climate_zone, region, zone, woreda, kebele, land_image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [farmerId, plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl]
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// 2. READ: Get Registry for Farmer
exports.getMyLandRegistry = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT lp.*, s.soil_type_name 
             FROM land_plots lp 
             LEFT JOIN soils s ON lp.soil_id = s.id
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)`,
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPDATE: Modify Existing Land
exports.updateLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const userId = req.user.userInternalId;
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, land_status } = req.body;

        await client.query('BEGIN');

        let landImageUrl = req.body.land_image_url; 
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;

        const updateQuery = `
            UPDATE land_plots SET 
                plot_name = COALESCE($1, plot_name), area_size = COALESCE($2, area_size),
                soil_id = COALESCE($3, soil_id), climate_zone = COALESCE($4, climate_zone),
                region = COALESCE($5, region), zone = COALESCE($6, zone),
                woreda = COALESCE($7, woreda), kebele = COALESCE($8, kebele),
                land_image_url = COALESCE($9, land_image_url), land_status = COALESCE($10, land_status)
            WHERE id = $11 AND farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $12)
            RETURNING *`;

        const result = await client.query(updateQuery, [plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl, land_status, id, userId]);
        
        await client.query('COMMIT');
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

// 4. DELETE: Remove Land Plot
exports.deleteLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const userId = req.user.userInternalId;
        await client.query('BEGIN');

        const ownershipCheck = await client.query(
            `SELECT lp.id, lp.land_image_url FROM land_plots lp 
             JOIN farmers f ON lp.farmer_id = f.id WHERE lp.id = $1 AND f.user_internal_id = $2`, [id, userId]);

        if (ownershipCheck.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        await client.query(`UPDATE animals SET current_land_plot_id = NULL WHERE current_land_plot_id = $1`, [id]);
        await client.query(`DELETE FROM crops WHERE land_plot_id = $1`, [id]);
        await client.query(`DELETE FROM land_plots WHERE id = $1`, [id]);

        await client.query('COMMIT');
        res.json({ success: true, message: "Land DROPPED from registry" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

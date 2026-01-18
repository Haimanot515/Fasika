const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

const uploadToSupabase = async (file, bucket = 'FarmerListing') => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `land_registry/${fileName}`; 
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

// 1. CREATE / DROP
exports.registerLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.userInternalId; 
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, crops, animals } = req.body;
        await client.query('BEGIN');

        let landImageUrl = req.file ? await uploadToSupabase(req.file) : null;
        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;
        const farmerRes = await client.query(`SELECT id FROM farmers WHERE user_internal_id = $1`, [userId]);
        const farmerId = farmerRes.rows[0].id;

        const landResult = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size, soil_id, climate_zone, region, zone, woreda, kebele, land_image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [farmerId, plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl]
        );
        const newLandId = landResult.rows[0].id;

        if (crops) {
            const parsedCrops = typeof crops === 'string' ? JSON.parse(crops) : crops;
            for (let c of parsedCrops) {
                await client.query(`INSERT INTO crops (land_plot_id, crop_name, quantity) VALUES ($1, $2, $3)`, [newLandId, c.crop_name, c.quantity]);
            }
        }
        if (animals) {
            const parsedAnimals = typeof animals === 'string' ? JSON.parse(animals) : animals;
            for (let a of parsedAnimals) {
                await client.query(`INSERT INTO animals (current_land_plot_id, animal_type, head_count) VALUES ($1, $2, $3)`, [newLandId, a.animal_type, a.head_count]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, landId: newLandId });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

// 2. GET / VIEW
exports.getMyLandRegistry = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT lp.*, s.soil_type_name,
                (SELECT COUNT(*) FROM crops WHERE land_plot_id = lp.id) as crop_count,
                (SELECT COUNT(*) FROM animals WHERE current_land_plot_id = lp.id) as animal_count
             FROM land_plots lp LEFT JOIN soils s ON lp.soil_id = s.id
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)`,
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. UPDATE (The function that was missing/undefined)
exports.updateLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const userId = req.user.userInternalId;
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele } = req.body;
        await client.query('BEGIN');

        let landImageUrl = req.body.land_image_url;
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;

        await client.query(
            `UPDATE land_plots SET plot_name=$1, area_size=$2, soil_id=$3, climate_zone=$4, region=$5, zone=$6, woreda=$7, kebele=$8, land_image_url=$9
             WHERE id=$10 AND farmer_id=(SELECT id FROM farmers WHERE user_internal_id=$11)`,
            [plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl, id, userId]
        );

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

// 4. DELETE
exports.deleteLand = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userInternalId;
        await pool.query(`DELETE FROM land_plots WHERE id=$1 AND farmer_id=(SELECT id FROM farmers WHERE user_internal_id=$2)`, [id, userId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

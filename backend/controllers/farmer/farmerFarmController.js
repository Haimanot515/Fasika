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

// 1. CREATE / DROP INTO REGISTRY
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
                await client.query(
                    `INSERT INTO crops (land_plot_id, crop_name, quantity) 
                     VALUES ($1, $2, $3)`, 
                    [newLandId, c.crop_name, c.quantity]
                );
            }
        }
        
        if (animals) {
            const parsedAnimals = typeof animals === 'string' ? JSON.parse(animals) : animals;
            for (let a of parsedAnimals) {
                await client.query(
                    `INSERT INTO animals (user_internal_id, current_land_plot_id, animal_type, head_count, tag_number) 
                     VALUES ($1, $2, $3, $4, $5)`, 
                    [userId, newLandId, a.animal_type, a.head_count, a.tag_number || `TAG-${Date.now()}-${Math.floor(Math.random() * 1000)}`]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, landId: newLandId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Registry DROP Error:", err.message);
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

// 2. GET / VIEW REGISTRY
exports.getMyLandRegistry = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT lp.*, s.soil_type_name,
                (SELECT COUNT(*) FROM crops WHERE land_plot_id = lp.id) as crop_count,
                (SELECT COUNT(*) FROM animals WHERE current_land_plot_id = lp.id) as animal_count
             FROM land_plots lp LEFT JOIN soils s ON lp.soil_id = s.id
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)
             ORDER BY lp.created_at DESC`,
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. UPDATE / DROP UPDATES
exports.updateLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const userId = req.user.userInternalId;
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, crops, animals } = req.body;

        if (!id || id === 'undefined') {
            return res.status(400).json({ error: "Invalid Registry ID: Frontend did not provide plot ID." });
        }

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

        if (crops) {
            await client.query(`DELETE FROM crops WHERE land_plot_id = $1`, [id]);
            const parsedCrops = typeof crops === 'string' ? JSON.parse(crops) : crops;
            for (let c of parsedCrops) {
                await client.query(
                    `INSERT INTO crops (land_plot_id, crop_name, quantity) VALUES ($1, $2, $3)`,
                    [id, c.crop_name, c.quantity]
                );
            }
        }

        if (animals) {
            await client.query(`DELETE FROM animals WHERE current_land_plot_id = $1`, [id]);
            const parsedAnimals = typeof animals === 'string' ? JSON.parse(animals) : animals;
            for (let a of parsedAnimals) {
                await client.query(
                    `INSERT INTO animals (user_internal_id, current_land_plot_id, animal_type, head_count, tag_number) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [userId, id, a.animal_type, a.head_count, a.tag_number || `TAG-UPD-${Date.now()}`]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Registry node UPDATED and DROPPED successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Registry UPDATE Error:", err.message);
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

// 4. DELETE / REMOVE FROM REGISTRY
exports.deleteLand = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userInternalId;
        await pool.query(`DELETE FROM land_plots WHERE id=$1 AND farmer_id=(SELECT id FROM farmers WHERE user_internal_id=$2)`, [id, userId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ==========================================
// NEWLY ADDED CONTROLLERS (SCALED FOR FRONTEND)
// ==========================================

// 5. GET DETAILED REGISTRY (Includes list of specific crops and animals per plot)
exports.getDetailedLandRegistry = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT 
                lp.*, 
                s.soil_type_name,
                COALESCE((
                    SELECT json_agg(c) FROM (
                        SELECT id, crop_name, quantity FROM crops WHERE land_plot_id = lp.id
                    ) c
                ), '[]'::json) as crop_list,
                COALESCE((
                    SELECT json_agg(a) FROM (
                        SELECT animal_id, animal_type, head_count, tag_number FROM animals WHERE current_land_plot_id = lp.id
                    ) a
                ), '[]'::json) as animal_list,
                (SELECT COUNT(*) FROM crops WHERE land_plot_id = lp.id) as crop_count,
                (SELECT COUNT(*) FROM animals WHERE current_land_plot_id = lp.id) as animal_count
             FROM land_plots lp 
             LEFT JOIN soils s ON lp.soil_id = s.id
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)
             ORDER BY lp.created_at DESC`,
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) { 
        console.error("Detailed Sync Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
};

// 6. GET TOTAL FARMER STATS (Aggregates across all tables)
exports.getFarmerRegistryStats = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const stats = await pool.query(
            `SELECT 
                COUNT(DISTINCT lp.id) as total_lands,
                COALESCE(SUM(lp.area_size), 0) as total_hectares,
                COALESCE((SELECT SUM(head_count) FROM animals WHERE user_internal_id = $1), 0) as total_animals,
                COALESCE((SELECT COUNT(*) FROM crops WHERE land_plot_id IN 
                    (SELECT id FROM land_plots WHERE farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1))
                ), 0) as total_crop_nodes
             FROM land_plots lp
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)`,
            [userId]
        );
        res.json({ success: true, stats: stats.rows[0] });
    } catch (err) { 
        console.error("Stats Sync Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
};

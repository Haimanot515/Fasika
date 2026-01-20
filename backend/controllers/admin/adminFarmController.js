// controllers/adminFarmController.js
const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');
const { v4: uuidv4 } = require('uuid');

/**
 * HELPER: Supabase Authority Upload
 * Ensures images are stored in the land_registry folder with an ADMIN prefix
 */
const uploadToSupabase = async (file, bucket = 'FarmerListing') => {
    if (!file) return null;
    const fileName = `ADMIN-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `land_registry/${fileName}`; 
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

/**
 * HELPER: Identity Resolver
 * Allows Admin to target a farmer by Email, Phone, or UUID
 */
const resolveFarmerId = async (input) => {
    if (!input) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(input)) return input;

    const result = await pool.query(
        `SELECT id FROM users WHERE email = $1 OR phone = $1 LIMIT 1`,
        [input]
    );
    return result.rowCount > 0 ? result.rows[0].id : null;
};

/**
 * ==========================================
 * GENERAL ADMIN REGISTRY ACTIONS (GLOBAL)
 * ==========================================
 */

const getAllFarms = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await pool.query(
            `SELECT lp.*, s.soil_type_name 
             FROM land_plots lp 
             LEFT JOIN soils s ON lp.soil_id = s.id 
             ORDER BY lp.created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
    } catch (err) {
        console.error('getAllFarms error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getFarmById = async (req, res) => {
    try {
        const { farmId } = req.params;
        const result = await pool.query(`SELECT * FROM land_plots WHERE id = $1`, [farmId]);
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm record not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('getFarmById error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteFarmAdmin = async (req, res) => {
    try {
        const { farmId } = req.params;
        const result = await pool.query(`DELETE FROM land_plots WHERE id=$1 RETURNING *`, [farmId]);
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm not found' });
        res.json({ success: true, message: 'Record DROPPED from registry', data: result.rows[0] });
    } catch (err) {
        console.error('deleteFarmAdmin error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * ============================================================
 * ADMIN ACTIONS FOR SPECIFIC FARMER (AUTHORITY INJECTION)
 * ============================================================
 */

const getFarmsByFarmer = async (req, res) => {
    try {
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity not found in registry' });

        const result = await pool.query(
            `SELECT lp.* FROM land_plots lp 
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1) 
             ORDER BY lp.created_at DESC`,
            [farmerId]
        );
        res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
    } catch (err) {
        console.error('getFarmsByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getFarmByFarmer = async (req, res) => {
    try {
        const { farmId } = req.params;
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity not found' });

        const result = await pool.query(
            `SELECT * FROM land_plots 
             WHERE farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1) AND id = $2`,
            [farmerId, farmId]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm record not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('getFarmByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addFarmForFarmer = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = await resolveFarmerId(req.params.farmerId);
        if (!userId) return res.status(404).json({ success: false, message: 'Identity resolution failed' });

        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, crops, animals } = req.body;
        
        await client.query('BEGIN');

        // 1. Supabase Image Drop
        let landImageUrl = req.file ? await uploadToSupabase(req.file) : null;

        // 2. Resolve IDs
        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;
        const farmerRes = await client.query(`SELECT id FROM farmers WHERE user_internal_id = $1`, [userId]);
        const farmerId = farmerRes.rows[0].id;

        // 3. DROP Land Plot
        const landResult = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size, soil_id, climate_zone, region, zone, woreda, kebele, land_image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [farmerId, plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl]
        );
        const newLandId = landResult.rows[0].id;

        // 4. DROP Crops
        if (crops) {
            const parsedCrops = typeof crops === 'string' ? JSON.parse(crops) : crops;
            for (let c of parsedCrops) {
                await client.query(
                    `INSERT INTO crops (land_plot_id, crop_name, quantity) VALUES ($1, $2, $3)`, 
                    [newLandId, c.crop_name, c.quantity]
                );
            }
        }
        
        // 5. DROP Animals
        if (animals) {
            const parsedAnimals = typeof animals === 'string' ? JSON.parse(animals) : animals;
            for (let a of parsedAnimals) {
                await client.query(
                    `INSERT INTO animals (user_internal_id, current_land_plot_id, animal_type, head_count, tag_number) 
                     VALUES ($1, $2, $3, $4, $5)`, 
                    [userId, newLandId, a.animal_type, a.head_count, a.tag_number || `ADM-TAG-${Date.now()}`]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: 'Registry node DROPPED successfully', landId: newLandId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('addFarmForFarmer error:', err);
        res.status(500).json({ success: false, message: err.message });
    } finally { client.release(); }
};

const updateFarmByFarmer = async (req, res) => {
    const client = await pool.connect();
    try {
        const { farmId } = req.params;
        const userId = await resolveFarmerId(req.params.farmerId);
        if (!userId) return res.status(404).json({ success: false, message: 'Identity not found' });

        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, crops, animals } = req.body;

        await client.query('BEGIN');

        let landImageUrl = req.body.land_image_url;
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;

        await client.query(
            `UPDATE land_plots SET plot_name=$1, area_size=$2, soil_id=$3, climate_zone=$4, region=$5, zone=$6, woreda=$7, kebele=$8, land_image_url=$9, updated_at=NOW()
             WHERE id=$10 AND farmer_id=(SELECT id FROM farmers WHERE user_internal_id=$11)`,
            [plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl, farmId, userId]
        );

        // Sync Biological Assets
        if (crops) {
            await client.query(`DELETE FROM crops WHERE land_plot_id = $1`, [farmId]);
            const parsedCrops = typeof crops === 'string' ? JSON.parse(crops) : crops;
            for (let c of parsedCrops) {
                await client.query(`INSERT INTO crops (land_plot_id, crop_name, quantity) VALUES ($1, $2, $3)`, [farmId, c.crop_name, c.quantity]);
            }
        }

        if (animals) {
            await client.query(`DELETE FROM animals WHERE current_land_plot_id = $1`, [farmId]);
            const parsedAnimals = typeof animals === 'string' ? JSON.parse(animals) : animals;
            for (let a of parsedAnimals) {
                await client.query(
                    `INSERT INTO animals (user_internal_id, current_land_plot_id, animal_type, head_count, tag_number) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [userId, farmId, a.animal_type, a.head_count, a.tag_number || `ADM-UPD-${Date.now()}`]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, message: 'Registry update DROPPED' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('updateFarmByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally { client.release(); }
};

const deleteFarmByFarmer = async (req, res) => {
    try {
        const { farmId } = req.params;
        const userId = await resolveFarmerId(req.params.farmerId);
        
        const result = await pool.query(
            `DELETE FROM land_plots WHERE id=$1 AND farmer_id=(SELECT id FROM farmers WHERE user_internal_id=$2) RETURNING *`,
            [farmId, userId]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm not found' });

        res.json({ success: true, message: 'Record DROPPED from registry', data: result.rows[0] });
    } catch (err) {
        console.error('deleteFarmByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getAllFarms,
    getFarmById,
    deleteFarmAdmin,
    getFarmsByFarmer,
    getFarmByFarmer,
    addFarmForFarmer,
    updateFarmByFarmer,
    deleteFarmByFarmer
};

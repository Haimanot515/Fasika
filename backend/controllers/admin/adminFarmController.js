const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/**
 * HELPER: Supabase Authority Upload
 * Prefixes with ADMIN-DROP to distinguish from farmer uploads
 */
const uploadToSupabase = async (file, bucket = 'FarmerListing') => {
    if (!file) return null;
    const fileName = `ADMIN-DROP-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `land_registry/${fileName}`; 
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

/**
 * HELPER: Identity Resolver
 * Resolves Email, Phone, or ID to internal user primary key
 */
const resolveFarmerId = async (input) => {
    if (!input) return null;
    if (!isNaN(input)) return parseInt(input);

    const result = await pool.query(
        `SELECT id FROM users WHERE email = $1 OR phone = $1 OR user_id = $1 LIMIT 1`,
        [input]
    );
    return result.rowCount > 0 ? result.rows[0].id : null;
};

/**
 * 1. SEARCH: Discovery Authority
 */
exports.searchFarmers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ success: false, message: "Search query required" });

        const result = await pool.query(
            `SELECT u.id, u.full_name, u.email, u.phone, u.photo_url 
             FROM users u
             JOIN farmers f ON u.id = f.user_internal_id
             WHERE u.full_name ILIKE $1 OR u.email ILIKE $1 OR u.phone ILIKE $1
             LIMIT 10`,
            [`%${query}%`]
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 2. GLOBAL VIEW: Full Registry Authority (Syncs with UI)
 * Fetches all land plots with owner names, soil types, and nested crop/animal lists
 */
exports.getAllFarms = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                lp.*, 
                f.full_name as owner_name, 
                u.email as owner_email,
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
                ), '[]'::json) as animal_list
             FROM land_plots lp 
             JOIN farmers f ON lp.farmer_id = f.id
             JOIN users u ON f.user_internal_id = u.id
             LEFT JOIN soils s ON lp.soil_id = s.id
             ORDER BY lp.created_at DESC`
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("GLOBAL REGISTRY SYNC ERROR:", err.message);
        res.status(500).json({ success: false, message: 'Database query failed' });
    }
};

/**
 * 3. TARGETED VIEW: Get Lands for a Specific Farmer
 */
exports.getFarmsByFarmer = async (req, res) => {
    try {
        const userId = await resolveFarmerId(req.params.farmerId);
        if (!userId) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const result = await pool.query(
            `SELECT lp.*, s.soil_type_name,
                COALESCE((SELECT json_agg(c) FROM crops c WHERE c.land_plot_id = lp.id), '[]'::json) as crop_list,
                COALESCE((SELECT json_agg(a) FROM animals a WHERE a.current_land_plot_id = lp.id), '[]'::json) as animal_list
             FROM land_plots lp 
             LEFT JOIN soils s ON lp.soil_id = s.id
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)
             ORDER BY lp.created_at DESC`,
            [userId]
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 4. CREATE: Add land (Authority Action)
 */
exports.addFarmForFarmer = async (req, res) => {
    const client = await pool.connect();
    try {
        const userInternalId = await resolveFarmerId(req.params.farmerId);
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, crops, animals } = req.body;
        
        await client.query('BEGIN');
        const landImageUrl = req.file ? await uploadToSupabase(req.file) : null;

        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const farmerRes = await client.query(`SELECT id FROM farmers WHERE user_internal_id = $1`, [userInternalId]);
        const farmerId = farmerRes.rows[0].id;

        const landResult = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size, soil_id, climate_zone, region, zone, woreda, kebele, land_image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [farmerId, plot_name, area_size, soilRes.rows[0]?.id || null, climate_zone, region, zone, woreda, kebele, landImageUrl]
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
                await client.query(
                    `INSERT INTO animals (user_internal_id, current_land_plot_id, animal_type, head_count, tag_number) 
                     VALUES ($1, $2, $3, $4, $5)`, 
                    [userInternalId, newLandId, a.animal_type, a.head_count, a.tag_number || `ADM-DROP-TAG-${Date.now()}`]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: "Authority DROP Success: Node Registered" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

/**
 * 5. UPDATE: Authority Overwrite
 */
exports.updateFarmAdmin = async (req, res) => {
    const client = await pool.connect();
    try {
        const { farmId } = req.params;
        const { plot_name, area_size, soil_type, climate_zone, region, zone, woreda, kebele, crops, animals } = req.body;

        await client.query('BEGIN');
        let landImageUrl = req.body.land_image_url;
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);

        await client.query(
            `UPDATE land_plots SET plot_name=$1, area_size=$2, soil_id=$3, climate_zone=$4, region=$5, zone=$6, woreda=$7, kebele=$8, land_image_url=$9
             WHERE id=$10`,
            [plot_name, area_size, soilRes.rows[0]?.id || null, climate_zone, region, zone, woreda, kebele, landImageUrl, farmId]
        );

        if (crops) {
            await client.query(`DELETE FROM crops WHERE land_plot_id = $1`, [farmId]);
            const parsedCrops = typeof crops === 'string' ? JSON.parse(crops) : crops;
            for (let c of parsedCrops) {
                await client.query(`INSERT INTO crops (land_plot_id, crop_name, quantity) VALUES ($1, $2, $3)`, [farmId, c.crop_name, c.quantity]);
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Registry node UPDATED and DROPPED by Authority" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally { client.release(); }
};

/**
 * 6. DELETE: Authority DROP Actions
 */
exports.deleteFarmAdmin = async (req, res) => {
    try {
        const { farmId } = req.params;
        await pool.query(`DELETE FROM land_plots WHERE id=$1`, [farmId]);
        res.json({ success: true, message: "Registry Node DROPPED" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteAllFarmsForFarmer = async (req, res) => {
    try {
        const userId = await resolveFarmerId(req.params.farmerId);
        await pool.query(`DELETE FROM land_plots WHERE farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)`, [userId]);
        res.json({ success: true, message: "Farmer Registry Segment DROPPED" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteAllFarmsGlobal = async (req, res) => {
    try {
        await pool.query(`DELETE FROM land_plots`);
        res.json({ success: true, message: "GLOBAL REGISTRY DROPPED" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

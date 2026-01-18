const pool = require('../../config/dbConfig');
const supabase = require('../../config/supabase');

/** * HELPER: Supabase Image Upload */
const uploadToSupabase = async (file, bucket = 'FarmerListing') => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `land_registry/${fileName}`; 
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
};

// 1. CREATE: Register Land + Insert Crops + Insert Animals
exports.registerLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.userInternalId; 
        const { 
            plot_name, area_size, soil_type, climate_zone, 
            region, zone, woreda, kebele,
            crops, animals // Arrays sent as JSON strings from frontend
        } = req.body;

        await client.query('BEGIN');

        // A. Image Upload
        let landImageUrl = null;
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        // B. Get Foreign Keys (Soil & Farmer)
        const soilRes = await client.query("SELECT id FROM soils WHERE soil_type_name = $1", [soil_type]);
        const soilId = soilRes.rows.length > 0 ? soilRes.rows[0].id : null;
        const farmerRes = await client.query(`SELECT id FROM farmers WHERE user_internal_id = $1`, [userId]);
        const farmerId = farmerRes.rows[0].id;

        // C. DROP Land Plot into Registry
        const landResult = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size, soil_id, climate_zone, region, zone, woreda, kebele, land_image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [farmerId, plot_name, area_size, soilId, climate_zone, region, zone, woreda, kebele, landImageUrl]
        );
        const newLandId = landResult.rows[0].id;

        // D. DROP Crops into Crops Table
        if (crops) {
            const parsedCrops = typeof crops === 'string' ? JSON.parse(crops) : crops;
            for (let crop of parsedCrops) {
                await client.query(
                    `INSERT INTO crops (land_plot_id, crop_name, quantity) VALUES ($1, $2, $3)`,
                    [newLandId, crop.crop_name, crop.quantity || 0]
                );
            }
        }

        // E. DROP Animals into Animals Table
        if (animals) {
            const parsedAnimals = typeof animals === 'string' ? JSON.parse(animals) : animals;
            for (let animal of parsedAnimals) {
                await client.query(
                    `INSERT INTO animals (current_land_plot_id, animal_type, head_count) VALUES ($1, $2, $3)`,
                    [newLandId, animal.animal_type, animal.head_count || 0]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: "Land and Assets Registered Successfully", landId: newLandId });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// 2. GET: Retrieve Registry with Asset Counts
exports.getMyLandRegistry = async (req, res) => {
    try {
        const userId = req.user.userInternalId;
        const result = await pool.query(
            `SELECT lp.*, s.soil_type_name,
                (SELECT COUNT(*) FROM crops WHERE land_plot_id = lp.id) as crop_types_count,
                (SELECT COALESCE(SUM(quantity), 0) FROM crops WHERE land_plot_id = lp.id) as total_crop_quantity,
                (SELECT COUNT(*) FROM animals WHERE current_land_plot_id = lp.id) as animal_types_count,
                (SELECT COALESCE(SUM(head_count), 0) FROM animals WHERE current_land_plot_id = lp.id) as total_animal_heads
             FROM land_plots lp 
             LEFT JOIN soils s ON lp.soil_id = s.id
             WHERE lp.farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $1)
             ORDER BY lp.created_at DESC`,
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

// 1. UPDATE: Modify Existing Land Registry
exports.updateLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params; // Land Plot ID
        const userId = req.user.userInternalId;
        const { 
            plot_name, area_size, soil_type, climate_zone,
            region, zone, woreda, kebele, land_status 
        } = req.body;

        await client.query('BEGIN');

        // Handle new image if provided
        let landImageUrl = req.body.land_image_url; 
        if (req.file) landImageUrl = await uploadToSupabase(req.file);

        const updateQuery = `
            UPDATE land_plots SET 
                plot_name = COALESCE($1, plot_name),
                area_size = COALESCE($2, area_size),
                soil_type = COALESCE($3, soil_type),
                climate_zone = COALESCE($4, climate_zone),
                region = COALESCE($5, region),
                zone = COALESCE($6, zone),
                woreda = COALESCE($7, woreda),
                kebele = COALESCE($8, kebele),
                land_image_url = COALESCE($9, land_image_url),
                land_status = COALESCE($10, land_status)
            WHERE id = $11 AND farmer_id = (SELECT id FROM farmers WHERE user_internal_id = $12)
            RETURNING *`;

        const result = await client.query(updateQuery, [
            plot_name, area_size, soil_type, climate_zone,
            region, zone, woreda, kebele, landImageUrl, land_status,
            id, userId
        ]);

        if (result.rows.length === 0) throw new Error("Land plot not found or unauthorized");

        await client.query('COMMIT');
        res.json({ success: true, message: "Land Registry Updated", data: result.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

// 2. DELETE: Remove Land Plot (DROP from Registry)
exports.deleteLand = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params; // Land Plot ID
        const userId = req.user.userInternalId;

        await client.query('BEGIN');

        // A. Verify ownership via Farmer table
        const ownershipCheck = await client.query(
            `SELECT lp.id, lp.land_image_url FROM land_plots lp 
             JOIN farmers f ON lp.farmer_id = f.id 
             WHERE lp.id = $1 AND f.user_internal_id = $2`,
            [id, userId]
        );

        if (ownershipCheck.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or Plot not found" });
        }

        // B. Cleanup: Animals associated with this land are moved to 'null' plot (unlinked)
        await client.query(
            `UPDATE animals SET current_land_plot_id = NULL WHERE current_land_plot_id = $1`,
            [id]
        );

        // C. Cleanup: Delete crops (Crops cannot exist without land)
        await client.query(`DELETE FROM crops WHERE land_plot_id = $1`, [id]);

        // D. Final: Delete the Land Plot
        await client.query(`DELETE FROM land_plots WHERE id = $1`, [id]);

        // E. Optional: Delete image from Supabase storage if it exists
        const oldImageUrl = ownershipCheck.rows[0].land_image_url;
        if (oldImageUrl) {
            const path = oldImageUrl.split(`${process.env.SUPABASE_URL}/storage/v1/object/public/FarmerListing/`)[1];
            if (path) {
                await supabase.storage.from('FarmerListing').remove([path]);
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Land and associated crops removed from registry" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

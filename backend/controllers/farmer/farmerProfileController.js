const pool = require('../config/dbConfig');

const distributeOnboardingData = async (req, res) => {
    // Master Key from your authenticate middleware
    const user_internal_id = req.user.id;

    const {
        // Farmer Table fields
        farm_name, farm_type, public_farmer_id,
        // Land Plot fields
        plot_name, area_size,
        // Crop fields
        crop_name, planting_date,
        // Animal fields
        tag_number, species
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. FARMERS Table: Using the Users ID as search key
        const farmerRes = await client.query(
            `INSERT INTO farmers (user_internal_id, farm_name, farm_type, public_farmer_id)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [user_internal_id, farm_name, farm_type, public_farmer_id]
        );
        const farmerId = farmerRes.rows[0].id;

        // 2. LAND_PLOTS Table: Linked to Farmer ID
        const plotRes = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size)
             VALUES ($1, $2, $3) RETURNING id`,
            [farmerId, plot_name, area_size]
        );
        const plotId = plotRes.rows[0].id;

        // 3. CROPS Table: Linked to Land Plot ID
        if (crop_name) {
            await client.query(
                `INSERT INTO crops (land_plot_id, crop_name, planting_date)
                 VALUES ($1, $2, $3)`,
                [plotId, crop_name, planting_date]
            );
        }

        // 4. ANIMALS Table: Linked directly to Users ID (Master Selector)
        if (tag_number) {
            await client.query(
                `INSERT INTO animals (user_internal_id, current_land_plot_id, tag_number, species)
                 VALUES ($1, $2, $3, $4)`,
                [user_internal_id, plotId, tag_number, species]
            );
        }

        await client.query('COMMIT'); // Commit all changes

        res.status(201).json({
            success: true,
            message: "Farmer registry successfully populated across all tables."
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Cancel if any insert fails
        console.error('Onboarding Error:', err);
        res.status(500).json({ error: 'Database sync failed', detail: err.message });
    } finally {
        client.release();
    }
};

module.exports = { distributeOnboardingData };

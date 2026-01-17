const db = require('../../config/dbConfig');

/**
 * MASTER DATA DISTRIBUTION CONTROLLER
 * Distributes form data into Farmers, Land Plots, Crops, and Animals tables.
 */
const distributeFarmerData = async (req, res) => {
    // user_internal_id comes from your decoded cookie/auth logic
    const { 
        user_internal_id, 
        farm_name, farm_type, public_farmer_id,
        plot_name, area_size,
        crop_name, planting_date,
        animal_tag, animal_species 
    } = req.body;

    const client = await db.connect();

    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Store in FARMERS
        const farmerRes = await client.query(
            `INSERT INTO farmers (user_internal_id, farm_name, farm_type, public_farmer_id) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [user_internal_id, farm_name, farm_type, public_farmer_id]
        );
        const farmerId = farmerRes.rows[0].id;

        // 2. Store in LAND_PLOTS
        const plotRes = await client.query(
            `INSERT INTO land_plots (farmer_id, plot_name, area_size) 
             VALUES ($1, $2, $3) RETURNING id`,
            [farmerId, plot_name, area_size]
        );
        const plotId = plotRes.rows[0].id;

        // 3. Store in CROPS
        if (crop_name) {
            await client.query(
                `INSERT INTO crops (land_plot_id, crop_name, planting_date) VALUES ($1, $2, $3)`,
                [plotId, crop_name, planting_date]
            );
        }

        // 4. Store in ANIMALS
        if (animal_tag) {
            await client.query(
                `INSERT INTO animals (user_internal_id, current_land_plot_id, tag_number, species) 
                 VALUES ($1, $2, $3, $4)`,
                [user_internal_id, plotId, animal_tag, animal_species]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: "Data distributed to all tables successfully." });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
};

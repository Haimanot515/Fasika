const db = require('../../config/db'); // Your database connection pool

const registerFarmerProfile = async (req, res) => {
    // Data gathered from the React Master Form
    const { 
        user_internal_id, // The ID from 'users' table
        farm_name, farm_type, public_farmer_id,
        plot_name, area_size,
        crop_name, planting_date 
    } = req.body;

    const client = await db.connect();

    try {
        await client.query('BEGIN'); // Start Transaction

        // 1. Insert into FARMERS table
        const farmerInsert = `
            INSERT INTO farmers (user_internal_id, farm_name, farm_type, public_farmer_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const farmerRes = await client.query(farmerInsert, [
            user_internal_id, farm_name || 'My Farm', farm_type, public_farmer_id
        ]);
        const farmerId = farmerRes.rows[0].id;

        // 2. Insert into LAND_PLOTS table (Linked to the new Farmer ID)
        const plotInsert = `
            INSERT INTO land_plots (farmer_id, plot_name, area_size, land_status)
            VALUES ($1, $2, $3, 'Active')
            RETURNING id;
        `;
        const plotRes = await client.query(plotInsert, [
            farmerId, plot_name, area_size
        ]);
        const plotId = plotRes.rows[0].id;

        // 3. Insert into CROPS table (Linked to the new Land Plot ID)
        if (crop_name) {
            const cropInsert = `
                INSERT INTO crops (land_plot_id, crop_name, planting_date, current_stage)
                VALUES ($1, $2, $3, 'Seedling');
            `;
            await client.query(cropInsert, [plotId, crop_name, planting_date]);
        }

        await client.query('COMMIT'); // Commit all changes to DB
        res.status(201).json({ success: true, message: "Farmer registry fully populated" });

    } catch (error) {
        await client.query('ROLLBACK'); // Undo all inserts if any step fails
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Database sync failed", detail: error.message });
    } finally {
        client.release();
    }
};

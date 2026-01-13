const db = require('../../config/dbConfig');

/**
 * 🔍 SYSTEM UTILITY: Search Farmers
 * Schema: farmers (id, farm_name, farmer_id, farm_type)
 */
exports.searchFarmers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ success: true, farmers: [] });

        const queryText = `
            SELECT id, farm_name AS name, farmer_id AS reg_no 
            FROM farmers 
            WHERE farm_name ILIKE $1 
            ORDER BY farm_name ASC 
            LIMIT 20`;
            
        const values = [`${q}%`]; 
        const results = await db.query(queryText, values);
        res.json({ success: true, farmers: results.rows });
    } catch (error) {
        console.error("Registry Search Error:", error);
        res.status(500).json({ success: false, error: "Database search failed" });
    }
};

/**
 * 🚜 1. LAND MANAGEMENT
 * Schema: land_plots (id, farmer_id, plot_name, area_size, land_status)
 */
exports.landOps = {
    viewAll: async (req, res) => {
        try {
            const result = await db.query(`
                SELECT lp.*, f.farm_name, f.farmer_id as official_reg_id 
                FROM land_plots lp 
                JOIN farmers f ON lp.farmer_id = f.id 
                ORDER BY lp.created_at DESC`);
            res.status(200).json({ success: true, data: result.rows });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    create: async (req, res) => {
        const { farmer_id, plot_name, area_size, land_status } = req.body;
        try {
            await db.query(
                "INSERT INTO land_plots (farmer_id, plot_name, area_size, land_status) VALUES ($1, $2, $3, $4)",
                [farmer_id, plot_name, area_size, land_status || 'Active']
            );
            res.status(201).json({ success: true, message: "Land record successfully DROPPED into registry." });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { plot_name, area_size, land_status } = req.body;
        try {
            await db.query(
                "UPDATE land_plots SET plot_name = $1, area_size = $2, land_status = $3 WHERE id = $4",
                [plot_name, area_size, land_status, id]
            );
            res.status(200).json({ success: true, message: "Land plot updated" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    drop: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query("DELETE FROM land_plots WHERE id = $1", [id]);
            res.status(200).json({ success: true, message: "Land plot record DROPPED" });
        } catch (err) { res.status(500).json({ error: "DROP operation failed" }); }
    }
};

/**
 * 🧪 2. SOIL REPORTS
 */
exports.soilOps = {
    viewAll: async (req, res) => {
        try {
            const result = await db.query(`
                SELECT sr.*, lp.plot_name 
                FROM soil_reports sr
                JOIN land_plots lp ON sr.land_plot_id = lp.id
                ORDER BY sr.test_date DESC`);
            res.status(200).json({ success: true, data: result.rows });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { status, remarks } = req.body;
        try {
            await db.query("UPDATE soil_reports SET status = $1, remarks = $2 WHERE id = $3", [status, remarks, id]);
            res.json({ success: true, message: "Soil report updated" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    drop: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query("DELETE FROM soil_reports WHERE id = $1", [id]);
            res.status(200).json({ success: true, message: "Soil report DROPPED" });
        } catch (err) { res.status(500).json({ error: "DROP failed" }); }
    }
};

/**
 * 🐄 3. LIVESTOCK CONTROL
 */
exports.livestockOps = {
    viewAll: async (req, res) => {
        try {
            const result = await db.query(`
                SELECT l.*, f.farm_name 
                FROM livestock l
                JOIN farmers f ON l.farmer_id = f.id`);
            res.status(200).json({ success: true, data: result.rows });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    create: async (req, res) => {
        const { farmer_id, animal_type, quantity, health_status } = req.body;
        try {
            await db.query(
                "INSERT INTO livestock (farmer_id, animal_type, quantity, health_status) VALUES ($1, $2, $3, $4)",
                [farmer_id, animal_type, quantity, health_status]
            );
            res.status(201).json({ success: true, message: "Livestock added" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { quantity, health_status } = req.body;
        try {
            await db.query("UPDATE livestock SET quantity = $1, health_status = $2 WHERE id = $3", [quantity, health_status, id]);
            res.json({ success: true, message: "Livestock updated" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    drop: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query("DELETE FROM livestock WHERE id = $1", [id]);
            res.status(200).json({ success: true, message: "Livestock record DROPPED" });
        } catch (err) { res.status(500).json({ error: "DROP failed" }); }
    }
};

/**
 * 🛒 4. MARKET ADS
 */
exports.marketOps = {
    viewAll: async (req, res) => {
        try {
            const result = await db.query("SELECT * FROM market_ads ORDER BY created_at DESC");
            res.status(200).json({ success: true, data: result.rows });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { price, status } = req.body;
        try {
            await db.query("UPDATE market_ads SET price = $1, status = $2 WHERE id = $3", [price, status, id]);
            res.json({ success: true, message: "Market ad updated" });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },
    drop: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query("DELETE FROM market_ads WHERE id = $1", [id]);
            res.status(200).json({ success: true, message: "Market listing DROPPED" });
        } catch (err) { res.status(500).json({ error: "DROP failed" }); }
    }
};

/**
 * 📊 5. SYSTEM UTILITIES
 */
exports.getGlobalStats = async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM land_plots) as total_lands,
                (SELECT COUNT(*) FROM livestock) as total_animals,
                (SELECT COUNT(*) FROM market_ads) as total_ads,
                (SELECT COUNT(*) FROM soil_reports) as total_soil_reports
        `);
        res.status(200).json({ success: true, data: stats.rows[0] });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

exports.verifyFarmerRecord = async (req, res) => {
    const { module, id } = req.params;
    let table = "";
    switch(module.toUpperCase()) {
        case 'LAND': table = "land_plots"; break;
        case 'SOIL': table = "soil_reports"; break;
        case 'LIVESTOCK': table = "livestock"; break;
        case 'MARKET': table = "market_ads"; break;
        default: return res.status(400).json({ success: false });
    }
    try {
        const check = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [id]);
        if (check.rows.length > 0) {
            res.status(200).json({ success: true, id: check.rows[0].id });
        } else {
            res.status(404).json({ success: false, message: "Record not found" });
        }
    } catch (err) { res.status(500).json({ success: false }); }
};
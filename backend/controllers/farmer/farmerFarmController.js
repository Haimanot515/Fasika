const pool = require('../../config/dbConfig');

/* ───── HELPER: Get Farmer ID ───── */
const getInternalFarmerId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT id FROM farmers WHERE user_internal_id = $1',
    [userId]
  );
  return rows[0]?.id || null;
};

/* ───── 🚜 SMART LAND REGISTRY (UNLIMITED ASSETS) ───── */
exports.addLand = async (req, res) => {
  const client = await pool.connect(); // Start connection for Transaction
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    if (!farmerId) {
      return res.status(404).json({ success: false, message: "Farmer profile missing from registry" });
    }

    const { plot_name, area_size, crops, animals } = req.body;

    await client.query('BEGIN'); // START TRANSACTION

    // 1. Register the Land Plot
    const landRes = await client.query(
      `INSERT INTO land_plots (farmer_id, plot_name, area_size, land_status)
       VALUES ($1, $2, $3, 'Active') RETURNING id`,
      [farmerId, plot_name, Number(area_size)]
    );
    const newLandId = landRes.rows[0].id;

    // 2. Register Unlimited Crops (if any)
    if (crops && crops.length > 0) {
      for (const cropName of crops) {
        await client.query(
          `INSERT INTO crops (land_plot_id, crop_name, current_stage)
           VALUES ($1, $2, 'Planted')`,
          [newLandId, cropName]
        );
      }
    }

    // 3. Register Unlimited Animals (if any)
    if (animals && animals.length > 0) {
      for (const species of animals) {
        await client.query(
          `INSERT INTO animals (user_internal_id, species, tag_number, health_status)
           VALUES ($1, $2, $3, 'Healthy')`,
          [req.user.id, species, `AUTO-${Math.floor(Math.random() * 10000)}`]
        );
      }
    }

    await client.query('COMMIT'); // SAVE EVERYTHING
    console.log(`✅ DROP Successful: Plot ${newLandId} with ${crops?.length} crops and ${animals?.length} animals.`);
    
    res.status(201).json({ success: true, message: "Asset DROPPED into registry" });

  } catch (err) {
    await client.query('ROLLBACK'); // CANCEL EVERYTHING ON ERROR
    console.error("❌ Registry Transaction Failed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};

/* ───── 📊 UPDATED SUMMARY (Includes Asset Counts) ───── */
exports.getLand = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    if (!farmerId) return res.status(404).json({ success: false, message: "Profile missing" });

    // Join to get counts of crops/animals for the UI cards
    const { rows } = await pool.query(
      `SELECT lp.*, 
        (SELECT COUNT(*) FROM crops WHERE land_plot_id = lp.id) as crop_count,
        (SELECT COUNT(*) FROM animals WHERE user_internal_id = $2) as total_animal_count
       FROM land_plots lp 
       WHERE lp.farmer_id = $1 
       ORDER BY lp.created_at DESC`,
      [farmerId, req.user.id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ───── 📊 DASHBOARD ───── */
exports.getFarmSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(`
      SELECT 
        u.full_name, f.farm_name, f.farm_type, f.public_farmer_id AS official_reg_no, 
        COALESCE(SUM(lp.area_size), 0) AS total_hectares,
        COUNT(DISTINCT lp.id) AS total_plots,
        (SELECT COUNT(*) FROM animals WHERE user_internal_id = u.id) AS total_livestock,
        (SELECT COUNT(*) FROM crops c JOIN land_plots l ON c.land_plot_id = l.id WHERE l.farmer_id = f.id) AS total_crops
      FROM users u
      JOIN farmers f ON f.user_internal_id = u.id
      LEFT JOIN land_plots lp ON lp.farmer_id = f.id
      WHERE u.id = $1
      GROUP BY u.full_name, f.farm_name, f.farm_type, f.public_farmer_id, f.id, u.id
    `, [userId]);

    res.json({ success: true, data: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ... keep updateLand and deleteLand as they were ...

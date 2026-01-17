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
  const client = await pool.connect(); 
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    if (!farmerId) return res.status(404).json({ success: false, message: "Farmer profile missing" });

    const { plot_name, area_size, crops, animals } = req.body;

    await client.query('BEGIN'); // START DROP TRANSACTION

    // 1. Register Land
    const landRes = await client.query(
      `INSERT INTO land_plots (farmer_id, plot_name, area_size, land_status)
       VALUES ($1, $2, $3, 'Active') RETURNING id`,
      [farmerId, plot_name, Number(area_size)]
    );
    const newLandId = landRes.rows[0].id;

    // 2. Register Unlimited Crops
    if (crops?.length > 0) {
      for (const cropName of crops) {
        await client.query(
          `INSERT INTO crops (land_plot_id, crop_name, current_stage) VALUES ($1, $2, 'Planted')`,
          [newLandId, cropName]
        );
      }
    }

    // 3. Register Unlimited Animals
    if (animals?.length > 0) {
      for (const species of animals) {
        await client.query(
          `INSERT INTO animals (user_internal_id, species, tag_number, health_status)
           VALUES ($1, $2, $3, 'Healthy')`,
          [req.user.id, species, `REG-${Math.random().toString(36).toUpperCase().slice(2, 7)}`]
        );
      }
    }

    await client.query('COMMIT'); 
    res.status(201).json({ success: true, message: "Asset successfully DROPPED into registry" });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};

/* ───── 🔄 UPDATE LAND (SYNCED) ───── */
/* ───── 🔄 UPDATE LAND (SYNCED) ───── */
exports.updateLand = async (req, res) => {
  const client = await pool.connect();
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    const { plot_name, area_size, land_status, crops, animals } = req.body;
    const { id } = req.params;

    await client.query('BEGIN'); // Start DROP Transaction

    // 1. Update Core Land Details
    const { rows } = await client.query(
      `UPDATE land_plots
       SET plot_name = $1, area_size = $2, land_status = $3
       WHERE id = $4 AND farmer_id = $5
       RETURNING *`,
      [plot_name, Number(area_size), land_status, id, farmerId]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: "Asset node not found" });
    }

    // 2. Sync Crops (DROP old ones and re-add to keep it simple)
    if (crops) {
      await client.query('DELETE FROM crops WHERE land_plot_id = $1', [id]);
      if (crops.length > 0) {
        for (const cropName of crops) {
          await client.query(
            `INSERT INTO crops (land_plot_id, crop_name, current_stage) VALUES ($1, $2, 'Planted')`,
            [id, cropName]
          );
        }
      }
    }

    // 3. Sync Animals (Optional: if your animals are linked to land or user)
    // Note: Your current animals table uses user_internal_id, not land_plot_id
    // If you want to sync animals here, add logic similar to crops above.

    await client.query('COMMIT');
    res.json({ success: true, message: "Registry node UPDATED and SYNCED", data: rows[0] });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};

/* ───── 🗑️ DROP LAND (DELETE) ───── */
exports.deleteLand = async (req, res) => {
  const client = await pool.connect();
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    const { id } = req.params;

    await client.query('BEGIN');
    
    // Cascade delete is usually handled by DB, but we ensure biology is dropped too
    await client.query('DELETE FROM crops WHERE land_plot_id = $1', [id]);
    await client.query('DELETE FROM land_plots WHERE id = $1 AND farmer_id = $2', [id, farmerId]);

    await client.query('COMMIT');
    res.json({ success: true, message: "Asset successfully DROPPED from registry" });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: "DROP operation failed" });
  } finally {
    client.release();
  }
};

/* ───── 🔍 GET REGISTRY (With Counts) ───── */
exports.getLand = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    if (!farmerId) return res.status(404).json({ success: false, message: "Registry access denied" });

    const { rows } = await pool.query(
      `SELECT lp.*, 
        (SELECT COUNT(*) FROM crops WHERE land_plot_id = lp.id) as crop_count
       FROM land_plots lp 
       WHERE lp.farmer_id = $1 
       ORDER BY lp.created_at DESC`,
      [farmerId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ───── 📊 DASHBOARD SUMMARY ───── */
exports.getFarmSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(`
      SELECT 
        u.full_name, f.farm_name, f.public_farmer_id, 
        COALESCE(SUM(lp.area_size), 0) AS total_hectares,
        COUNT(DISTINCT lp.id) AS total_plots,
        (SELECT COUNT(*) FROM animals WHERE user_internal_id = u.id) AS total_livestock,
        (SELECT COUNT(*) FROM crops c JOIN land_plots l ON c.land_plot_id = l.id WHERE l.farmer_id = f.id) AS total_crops
      FROM users u
      JOIN farmers f ON f.user_internal_id = u.id
      LEFT JOIN land_plots lp ON lp.farmer_id = f.id
      WHERE u.id = $1
      GROUP BY u.full_name, f.farm_name, f.public_farmer_id, f.id, u.id
    `, [userId]);

    res.json({ success: true, data: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

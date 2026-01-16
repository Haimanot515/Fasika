const pool = require('../../config/dbConfig');

/* ───── HELPER: Get Farmer ID ───── */
const getInternalFarmerId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT id FROM farmers WHERE user_internal_id = $1',
    [userId]
  );
  return rows[0]?.id || null;
};

/* ───── 📊 DASHBOARD ───── */
exports.getFarmSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(`
      SELECT 
        u.full_name,
        f.farm_name,
        f.farm_type,
        f.public_farmer_id AS official_reg_no, 
        COALESCE(SUM(lp.area_size), 0) AS total_hectares,
        COUNT(DISTINCT lp.id) AS total_plots,
        (SELECT COUNT(*) FROM animals WHERE user_internal_id = u.id) AS total_livestock,
        COUNT(DISTINCT c.id) AS total_crops
      FROM users u
      JOIN farmers f ON f.user_internal_id = u.id
      LEFT JOIN land_plots lp ON lp.farmer_id = f.id
      LEFT JOIN crops c ON c.land_plot_id = lp.id
      WHERE u.id = $1
      GROUP BY u.full_name, f.farm_name, f.farm_type, f.public_farmer_id, u.id
    `, [userId]);

    res.json({ success: true, data: rows[0] || {} });
  } catch (err) {
    console.error("Dashboard Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ───── 🚜 LAND PLOTS ───── */
exports.addLand = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    
    if (!farmerId) {
        console.warn(`[REGISTRY] AddLand failed: No farmer profile for User ${req.user.id}`);
        return res.status(404).json({ success: false, message: "Farmer profile missing from registry" });
    }

    const { plot_name, area_size, land_status } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO land_plots (farmer_id, plot_name, area_size, land_status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [farmerId, plot_name, Number(area_size), land_status || 'Active']
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("AddLand DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLand = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    
    if (!farmerId) {
        return res.status(404).json({ success: false, message: "Farmer profile missing" });
    }

    const { rows } = await pool.query(
      'SELECT * FROM land_plots WHERE farmer_id = $1 ORDER BY created_at DESC',
      [farmerId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GetLand DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateLand = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    const { plot_name, area_size, land_status } = req.body;

    const { rows } = await pool.query(
      `UPDATE land_plots
       SET plot_name=$1, area_size=$2, land_status=$3
       WHERE id=$4 AND farmer_id=$5
       RETURNING *`,
      [plot_name, area_size, land_status, req.params.id, farmerId]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteLand = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);

    await pool.query(
      'DELETE FROM land_plots WHERE id=$1 AND farmer_id=$2',
      [req.params.id, farmerId]
    );

    res.json({ success: true, message: "Land plot deleted from registry" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
};

/* ───── 🌿 CROPS (SECURED) ───── */
exports.addCrop = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);
    const { land_plot_id, crop_name, current_stage, planting_date } = req.body;

    const land = await pool.query(
      'SELECT id FROM land_plots WHERE id=$1 AND farmer_id=$2',
      [land_plot_id, farmerId]
    );
    if (!land.rows.length)
      return res.status(403).json({ success: false, message: "Unauthorized land access" });

    const { rows } = await pool.query(
      `INSERT INTO crops (land_plot_id, crop_name, current_stage, planting_date)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [land_plot_id, crop_name, current_stage || 'Seedling', planting_date]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFarmerCrops = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);

    const { rows } = await pool.query(
      `SELECT c.*, lp.plot_name
       FROM crops c
       JOIN land_plots lp ON c.land_plot_id = lp.id
       WHERE lp.farmer_id = $1`,
      [farmerId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateCropStage = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);

    const { rows } = await pool.query(
      `UPDATE crops c
       SET current_stage=$1
       FROM land_plots lp
       WHERE c.id=$2 AND c.land_plot_id=lp.id AND lp.farmer_id=$3
       RETURNING c.*`,
      [req.body.stage, req.params.cropId, farmerId]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const farmerId = await getInternalFarmerId(req.user.id);

    await pool.query(
      `DELETE FROM crops
       USING land_plots
       WHERE crops.id=$1
       AND crops.land_plot_id=land_plots.id
       AND land_plots.farmer_id=$2`,
      [req.params.cropId, farmerId]
    );

    res.json({ success: true, message: "Crop removed from registry" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ───── 🐄 ANIMALS (SECURED) ───── */
exports.addAnimal = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO animals (user_internal_id, tag_number, species, breed, health_status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, req.body.tag_number, req.body.species, req.body.breed, req.body.health_status || 'Healthy']
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAnimals = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM animals WHERE user_internal_id=$1',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE animals
       SET health_status=$1, breed=$2
       WHERE id=$3 AND user_internal_id=$4
       RETURNING *`,
      [req.body.health_status, req.body.breed, req.params.animalId, req.user.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM animals WHERE id=$1 AND user_internal_id=$2',
      [req.params.animalId, req.user.id]
    );

    res.json({ success: true, message: "Livestock asset removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

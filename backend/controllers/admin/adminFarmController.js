// controllers/adminFarmController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * ==============================
 * General Admin Farm Actions
 * ==============================
 */

/**
 * Get all farms (optionally with pagination)
 */
const getAllFarms = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT * FROM farms
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
  } catch (err) {
    console.error('getAllFarms error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get a single farm by ID
 */
const getFarmById = async (req, res) => {
  try {
    const { farmId } = req.params;

    const result = await pool.query(
      `SELECT * FROM farms WHERE farm_id = $1`,
      [farmId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getFarmById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Delete any farm (admin)
 */
const deleteFarmAdmin = async (req, res) => {
  try {
    const { farmId } = req.params;

    const result = await pool.query(
      `DELETE FROM farms WHERE farm_id=$1 RETURNING *`,
      [farmId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    res.json({ success: true, message: 'Farm deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('deleteFarmAdmin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * ==============================
 * Admin CRUD for a specific farmer
 * ==============================
 */

/**
 * Get all farms of a single farmer
 */
const getFarmsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT * FROM farms
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [farmerId, limit, offset]
    );

    res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
  } catch (err) {
    console.error('getFarmsByFarmer error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get a single farm of a farmer
 */
const getFarmByFarmer = async (req, res) => {
  try {
    const { farmerId, farmId } = req.params;

    const result = await pool.query(
      `SELECT * FROM farms
       WHERE user_id = $1 AND farm_id = $2`,
      [farmerId, farmId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getFarmByFarmer error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Add a new farm for a farmer (admin)
 */
const addFarmForFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    let {
      farmName,
      description,
      sizeHectares,
      soilType,
      irrigationType,
      waterSource,
      latitude,
      longitude,
      region,
      zone,
      woreda,
      kebele,
      locationMethod,
      radiusMeters,
      previousLocationId
    } = req.body;

    if (!farmName || !sizeHectares || !region) {
      return res.status(400).json({ success: false, message: 'farmName, sizeHectares and region are required' });
    }
    if (sizeHectares <= 0) return res.status(400).json({ success: false, message: 'sizeHectares must be > 0' });

    // Handle location logic
    if (locationMethod === 'REGION') {
      latitude = latitude || null;
      longitude = longitude || null;
    } else if (['GPS', 'MANUAL'].includes(locationMethod)) {
      if (latitude == null || longitude == null)
        return res.status(400).json({ success: false, message: 'Coordinates required for GPS/manual' });
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
        return res.status(400).json({ success: false, message: 'Invalid latitude/longitude' });
    } else if (locationMethod === 'HISTORY') {
      if (!previousLocationId)
        return res.status(400).json({ success: false, message: 'previousLocationId required' });

      const prev = await pool.query(
        `SELECT latitude, longitude, region, zone, woreda, kebele
         FROM farm_locations
         WHERE id=$1 LIMIT 1`,
        [previousLocationId]
      );
      if (!prev.rowCount) return res.status(404).json({ success: false, message: 'Previous location not found' });

      const loc = prev.rows[0];
      latitude = loc.latitude;
      longitude = loc.longitude;
      region = loc.region;
      zone = loc.zone;
      woreda = loc.woreda;
      kebele = loc.kebele;
    }

    if (locationMethod === 'RADIUS') {
      if (!radiusMeters || radiusMeters <= 0) return res.status(400).json({ success: false, message: 'Valid radius required' });
      if (latitude == null || longitude == null)
        return res.status(400).json({ success: false, message: 'Coordinates required for radius' });
    }

    const farmId = `FARM-${uuidv4()}`;

    const result = await pool.query(
      `INSERT INTO farms
        (farm_id, user_id, farm_name, description, size_hectares, soil_type, irrigation_type, water_source, latitude, longitude, region, zone, woreda, kebele, location_method, radius_meters, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW(),NOW())
       RETURNING *`,
      [farmId, farmerId, farmName.trim(), description || null, sizeHectares, soilType || null, irrigationType || null, waterSource || null, latitude, longitude, region, zone || null, woreda || null, kebele || null, locationMethod, radiusMeters || 0]
    );

    // Save location history
    if (latitude != null && longitude != null) {
      await pool.query(
        `INSERT INTO farm_locations
         (farm_id, latitude, longitude, region, zone, woreda, kebele, location_method)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [farmId, latitude, longitude, region, zone, woreda, kebele, locationMethod]
      );
    }

    return res.status(201).json({ success: true, message: 'Farm added successfully', data: result.rows[0] });
  } catch (err) {
    console.error('addFarmForFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Update a farm of a specific farmer (admin)
 */
const updateFarmByFarmer = async (req, res) => {
  try {
    const { farmerId, farmId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'No updates provided' });

    let { latitude, longitude, locationMethod, radiusMeters, previousLocationId, region, zone, woreda, kebele } = updates;

    // Location logic same as addFarmForFarmer
    if (locationMethod === 'REGION') latitude = latitude || null;
    else if (['GPS', 'MANUAL'].includes(locationMethod)) {
      if (latitude == null || longitude == null) return res.status(400).json({ success: false, message: 'Coordinates required' });
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return res.status(400).json({ success: false, message: 'Invalid latitude/longitude' });
    } else if (locationMethod === 'HISTORY') {
      if (!previousLocationId) return res.status(400).json({ success: false, message: 'previousLocationId required' });
      const prev = await pool.query(
        `SELECT latitude, longitude, region, zone, woreda, kebele
         FROM farm_locations
         WHERE id=$1 LIMIT 1`,
        [previousLocationId]
      );
      if (!prev.rowCount) return res.status(404).json({ success: false, message: 'Previous location not found' });
      const loc = prev.rows[0];
      latitude = loc.latitude;
      longitude = loc.longitude;
      region = loc.region;
      zone = loc.zone;
      woreda = loc.woreda;
      kebele = loc.kebele;
    } else if (locationMethod === 'RADIUS') {
      if (!radiusMeters || radiusMeters <= 0) return res.status(400).json({ success: false, message: 'Valid radius required' });
      if (latitude == null || longitude == null) return res.status(400).json({ success: false, message: 'Coordinates required for radius' });
    }

    // Dynamic query
    const fields = Object.keys(updates).map((key, i) => `${key}=$${i + 1}`);
    const values = [...Object.values(updates), farmId, farmerId];

    const query = `
      UPDATE farms
      SET ${fields.join(',')}, updated_at=NOW()
      WHERE farm_id=$${values.length - 1} AND user_id=$${values.length}
      RETURNING *
    `;
    const result = await pool.query(query, values);

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm not found' });

    // Save location history
    if (latitude != null && longitude != null) {
      await pool.query(
        `INSERT INTO farm_locations
         (farm_id, latitude, longitude, region, zone, woreda, kebele, location_method)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [farmId, latitude, longitude, region, zone, woreda, kebele, locationMethod]
      );
    }

    res.json({ success: true, message: 'Farm updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('updateFarmByFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Delete a farm of a specific farmer (admin)
 */
const deleteFarmByFarmer = async (req, res) => {
  try {
    const { farmerId, farmId } = req.params;

    const result = await pool.query(
      `DELETE FROM farms WHERE farm_id=$1 AND user_id=$2 RETURNING *`,
      [farmId, farmerId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm not found' });

    res.json({ success: true, message: 'Farm deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('deleteFarmByFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllFarms,
  getFarmById,
  deleteFarmAdmin,
  getFarmsByFarmer,
  getFarmByFarmer,
  addFarmForFarmer,
  updateFarmByFarmer,
  deleteFarmByFarmer
};

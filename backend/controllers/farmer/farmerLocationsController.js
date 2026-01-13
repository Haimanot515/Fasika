// controllers/locationController.js
const pool = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * GET all user locations + farms
 * Used by frontend to populate dropdowns for selecting active farm/location
 */
const getUserLocations = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user ID
    const client = await pool.connect();

    const locationsQuery = `SELECT * FROM user_locations WHERE user_id=$1`;
    const farmsQuery = `SELECT farm_id, farm_name, latitude, longitude FROM farms WHERE user_id=$1`;

    const [locationsResult, farmsResult] = await Promise.all([ // pagination shoud be appliedhere because ifthere aremany saved location the userscroldown many location in the dropdowen

      client.query(locationsQuery, [userId]),
      client.query(farmsQuery, [userId])
    ]);

    client.release();

    return res.json({
      success: true,
      locations: locationsResult.rows,
      farms: farmsResult.rows
    });
  } catch (err) {
    console.error('getUserLocations error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * SET active location context
 * contextType: "MANUAL" | "LIVE_GPS"
 */
const setLocationContext = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contextType, farmId, locationId } = req.body;

    const client = await pool.connect();

    const existingQuery = `SELECT * FROM farmer_location_context WHERE user_id=$1`;
    const existing = await client.query(existingQuery, [userId]);

    if (existing.rows.length) {
      // Update existing context
      const updateQuery = `
        UPDATE farmer_location_context
        SET context_type=$1, farm_id=$2, location_id=$3, is_live_gps=$4, last_updated=NOW()
        WHERE user_id=$5
      `;
      await client.query(updateQuery, [
        contextType,
        farmId || null,
        locationId || null,
        contextType === 'LIVE_GPS',
        userId
      ]);
    } else {
      // Insert new context
      const insertQuery = `
        INSERT INTO user_location_context
        (user_id, context_type, farm_id, location_id, is_live_gps, last_updated)
        VALUES ($1,$2,$3,$4,$5,NOW())
      `;
      await client.query(insertQuery, [
        userId,
        contextType,
        farmId || null,
        locationId || null,
        contextType === 'LIVE_GPS'
      ]);
    }

    client.release();
    return res.json({ success: true, message: 'Location context updated' });
  } catch (err) {
    console.error('setLocationContext error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * CREATE Favrite location (manual or GPS)
 */
const addFavriteLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      locationName,
      locationType,
      region,
      zone,
      woreda,
      kebele,
      latitude,
      longitude,
      altitude,
      isPrimary = false,
      createdFrom = 'MANUAL'
    } = req.body;

    const client = await pool.connect();
    const locationId = uuidv4();

    const query = `
      INSERT INTO saved_locations
      (location_id, user_id, location_name, location_type, region, zone, woreda, kebele,
       latitude, longitude, altitude_m, is_primary, created_from, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
    `;

    await client.query(query, [
      locationId,
      userId,
      locationName,
      locationType,
      region,
      zone,
      woreda,
      kebele,
      latitude,
      longitude,
      altitude,
      isPrimary,
      createdFrom
    ]);

    client.release();
    return res.status(201).json({ success: true, message: 'Location added', locationId });
  } catch (err) {
    console.error('addUserLocation error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  getUserLocations,
  setLocationContext,
  addFavriteLocation
};

// services/locationResolver.js
const pool = require('../config/dbConfig');

/**
 * Resolve user's effective location based on current context
 * This function is the SINGLE SOURCE OF TRUTH for all location-based features
 */
exports.resolveUserLocation = async (userId,farmId) => {
  // 1️⃣ Get current context
  const ctxResult = await pool.query(
    `
    SELECT *
    FROM farmer_location_context
    WHERE user_id = $1
    ORDER BY last_updated DESC
    LIMIT 1
    `,
    [userId]
  );

  if (!ctxResult.rowCount) {
    return { error: 'NO_CONTEXT_SELECTED' };
  }

  const context = ctxResult.rows[0];

  switch (context.context_type) {

    // 🏠 HOME CONTEXT
    case 'HOME': {
      const home = await pool.query(
        `
        SELECT latitude, longitude, region, zone, woreda, kebele
        FROM saved_locations
        WHERE user_id = $1
          AND location_type = 'HOME'
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [userId]
      );

      if (!home.rowCount) {
        return { error: 'HOME_LOCATION_NOT_FOUND' };
      }

      return home.rows[0];
    }

    // 🗺 REGION CONTEXT
    case 'REGION': {
      const regionLocation = await pool.query(
        `
        SELECT latitude, longitude, region, zone, woreda, kebele
        FROM saved_locations
        WHERE user_id = $1
          AND location_type = 'REGION'
          AND region = $2
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [userId, context.region]
      );

      if (!regionLocation.rowCount) {
        return {
          error: 'REGION_LOCATION_NOT_FOUND',
          message: 'Please add a saved location for this region'
        };
      }

      return regionLocation.rows[0];
    }

    // 🌾 FARM CONTEXT
    case 'FARM': {
      const farm = await pool.query(
        `
        SELECT latitude, longitude, region, zone, woreda, kebele
        FROM farms
        WHERE farm_id = $1
        `,
        [context.farm_id]
      );

      if (!farm.rowCount) {
        return { error: 'FARM_LOCATION_NOT_FOUND' };
      }

      return farm.rows[0];
    }

    // 📍 LIVE GPS CONTEXT
    case 'LIVE_GPS': {
      const gps = await pool.query(
        `
        SELECT latitude, longitude, region, zone, woreda, kebele
        FROM user_locations
        WHERE user_id = $1
          AND created_from = 'GPS'
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [userId]
      );

      if (!gps.rowCount) {
        return {
          error: 'LIVE_GPS_REQUIRED',
          message: 'Device GPS must be enabled'
        };
      }

      return gps.rows[0];
    }

    // 🎯 EVENT CONTEXT
    case 'EVENT': {
      const eventLoc = await pool.query(
        `
        SELECT latitude, longitude, region, zone, woreda, kebele
        FROM saved_locations
        WHERE userId= $1
         AND location_type='EVENT'
         ORDER BY created_at DESC
         LIMIT 1
        `,
        [context.userId]
      );

      if (!eventLoc.rowCount) {
        return { error: 'EVENT_LOCATION_NOT_FOUND' };
      }

      return eventLoc.rows[0];
    }

    default:
      return { error: 'INVALID_CONTEXT_TYPE' };
  }
};

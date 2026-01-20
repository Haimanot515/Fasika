// controllers/adminFarmController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * HELPER: Identity Resolver
 * Converts Email, Phone, or UUID into a valid User ID
 */
const resolveFarmerId = async (input) => {
    if (!input) return null;
    
    // 1. Check if input is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(input)) return input;

    // 2. Otherwise, lookup by Email or Phone
    const result = await pool.query(
        `SELECT id FROM users WHERE email = $1 OR phone = $1 LIMIT 1`,
        [input]
    );
    
    return result.rowCount > 0 ? result.rows[0].id : null;
};

/**
 * ==============================
 * General Admin Farm Actions
 * ==============================
 */

const getAllFarms = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await pool.query(
            `SELECT * FROM farms ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
    } catch (err) {
        console.error('getAllFarms error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getFarmById = async (req, res) => {
    try {
        const { farmId } = req.params;
        const result = await pool.query(`SELECT * FROM farms WHERE farm_id = $1`, [farmId]);
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm record not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('getFarmById error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteFarmAdmin = async (req, res) => {
    try {
        const { farmId } = req.params;
        const result = await pool.query(`DELETE FROM farms WHERE farm_id=$1 RETURNING *`, [farmId]);
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm not found' });
        res.json({ success: true, message: 'Record DROPPED from registry', data: result.rows[0] });
    } catch (err) {
        console.error('deleteFarmAdmin error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * ==============================
 * Admin CRUD for a specific farmer (Supports Email/Phone/UUID)
 * ==============================
 */

const getFarmsByFarmer = async (req, res) => {
    try {
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity not found in registry' });

        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const result = await pool.query(
            `SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
            [farmerId, limit, offset]
        );
        res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
    } catch (err) {
        console.error('getFarmsByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getFarmByFarmer = async (req, res) => {
    try {
        const { farmId } = req.params;
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity not found' });

        const result = await pool.query(
            `SELECT * FROM farms WHERE user_id = $1 AND farm_id = $2`,
            [farmerId, farmId]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm record not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('getFarmByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addFarmForFarmer = async (req, res) => {
    try {
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity resolution failed' });

        let {
            farmName, description, sizeHectares, soilType, irrigationType,
            waterSource, latitude, longitude, region, zone, woreda, kebele,
            locationMethod, radiusMeters, previousLocationId
        } = req.body;

        if (!farmName || !sizeHectares || !region) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        // Location History logic
        if (locationMethod === 'HISTORY') {
            const prev = await pool.query(`SELECT * FROM farm_locations WHERE id=$1 LIMIT 1`, [previousLocationId]);
            if (prev.rowCount) {
                const loc = prev.rows[0];
                latitude = loc.latitude; longitude = loc.longitude;
                region = loc.region; zone = loc.zone; woreda = loc.woreda; kebele = loc.kebele;
            }
        }

        const farmId = `FARM-${uuidv4()}`;
        const result = await pool.query(
            `INSERT INTO farms
            (farm_id, user_id, farm_name, description, size_hectares, soil_type, irrigation_type, water_source, latitude, longitude, region, zone, woreda, kebele, location_method, radius_meters, created_at, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW(),NOW())
            RETURNING *`,
            [farmId, farmerId, farmName.trim(), description || null, sizeHectares, soilType || null, irrigationType || null, waterSource || null, latitude, longitude, region, zone || null, woreda || null, kebele || null, locationMethod, radiusMeters || 0]
        );

        res.status(201).json({ success: true, message: 'Farm record successfully DROPPED', data: result.rows[0] });
    } catch (err) {
        console.error('addFarmForFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateFarmByFarmer = async (req, res) => {
    try {
        const { farmId } = req.params;
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity not found' });

        const updates = req.body;
        if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'No updates provided' });

        const fields = Object.keys(updates).map((key, i) => `${key}=$${i + 1}`);
        const values = [...Object.values(updates), farmId, farmerId];

        const query = `
            UPDATE farms SET ${fields.join(',')}, updated_at=NOW()
            WHERE farm_id=$${values.length - 1} AND user_id=$${values.length}
            RETURNING *
        `;
        const result = await pool.query(query, values);
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Update failed: Farm not found' });

        res.json({ success: true, message: 'Registry update DROPPED', data: result.rows[0] });
    } catch (err) {
        console.error('updateFarmByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteFarmByFarmer = async (req, res) => {
    try {
        const { farmId } = req.params;
        const farmerId = await resolveFarmerId(req.params.farmerId);
        if (!farmerId) return res.status(404).json({ success: false, message: 'Identity not found' });

        const result = await pool.query(
            `DELETE FROM farms WHERE farm_id=$1 AND user_id=$2 RETURNING *`,
            [farmId, farmerId]
        );
        if (!result.rowCount) return res.status(404).json({ success: false, message: 'Farm not found' });

        res.json({ success: true, message: 'Record DROPPED from registry', data: result.rows[0] });
    } catch (err) {
        console.error('deleteFarmByFarmer error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
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

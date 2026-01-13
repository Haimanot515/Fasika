// controllers/adminAdvisoryController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * =========================
 * Advisory Management (Admin)
 * =========================
 */

// Utility for building dynamic WHERE clauses
const buildConditions = (queryParams, mappings = {}) => {
  const conditions = [];
  const values = [];
  let counter = 1;

  for (const key in queryParams) {
    if (!queryParams[key]) continue;

    let column = mappings[key] || key;
    let value = queryParams[key];

    // Apply formatting if needed
    if (['advisory_type'].includes(key)) value = value.toLowerCase();
    if (['urgency'].includes(key)) value = value.toUpperCase();

    conditions.push(`${column} = $${counter++}`);
    values.push(value);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, values, counter };
};

/**
 * 1️⃣ Get all advisories
 * Optional query params: type, urgency, region, limit, offset
 */
const getAllAdvisories = async (req, res) => {
  try {
    const { type, urgency, region, limit = 20, offset = 0 } = req.query;

    const { whereClause, values, counter } = buildConditions({ type, urgency, region });

    const result = await pool.query(
      `SELECT * FROM advisories ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${counter} OFFSET $${counter + 1}`,
      [...values, limit, offset]
    );

    res.json({ success: true, count: result.rowCount, advisories: result.rows });
  } catch (err) {
    console.error('getAllAdvisories error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 2️⃣ Get advisory by ID
 */
const getAdvisoryById = async (req, res) => {
  try {
    const { advisoryId } = req.params;
    const result = await pool.query(`SELECT * FROM advisories WHERE advisory_id = $1`, [advisoryId]);

    if (!result.rowCount)
      return res.status(404).json({ success: false, message: 'Advisory not found' });

    res.json({ success: true, advisory: result.rows[0] });
  } catch (err) {
    console.error('getAdvisoryById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 3️⃣ Create advisory
 */
const createAdvisory = async (req, res) => {
  try {
    const { title, advisory_type, content, urgency, region, zone, woreda, kebele } = req.body;

    if (!title || !advisory_type || !content || !urgency) {
      return res.status(400).json({ message: 'Title, type, content, and urgency are required' });
    }

    const advisoryId = uuidv4();

    const result = await pool.query(
      `INSERT INTO advisories (
         advisory_id, title, advisory_type, content, urgency, region, zone, woreda, kebele, created_at, updated_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING *`,
      [
        advisoryId,
        title,
        advisory_type.toLowerCase(),
        content,
        urgency.toUpperCase(),
        region || null,
        zone || null,
        woreda || null,
        kebele || null
      ]
    );

    res.status(201).json({ success: true, message: 'Advisory created', advisory: result.rows[0] });
  } catch (err) {
    console.error('createAdvisory error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 4️⃣ Update advisory (full or partial)
 */
const updateAdvisory = async (req, res) => {
  try {
    const { advisoryId } = req.params;
    const fields = req.body;

    const setClause = [];
    const values = [];
    let counter = 1;

    for (const key in fields) {
      if (['advisory_type'].includes(key) && fields[key]) fields[key] = fields[key].toLowerCase();
      if (['urgency'].includes(key) && fields[key]) fields[key] = fields[key].toUpperCase();
      setClause.push(`${key} = $${counter++}`);
      values.push(fields[key]);
    }

    if (!setClause.length) return res.status(400).json({ message: 'No fields to update' });

    values.push(advisoryId);

    const result = await pool.query(
      `UPDATE advisories SET ${setClause.join(', ')}, updated_at = NOW() WHERE advisory_id = $${counter} RETURNING *`,
      values
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Advisory not found' });

    res.json({ success: true, message: 'Advisory updated', advisory: result.rows[0] });
  } catch (err) {
    console.error('updateAdvisory error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 5️⃣ Delete advisory (soft delete)
 */
const deleteAdvisory = async (req, res) => {
  try {
    const { advisoryId } = req.params;

    const result = await pool.query(
      `UPDATE advisories SET deleted_at = NOW() WHERE advisory_id = $1 RETURNING *`,
      [advisoryId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Advisory not found' });

    res.json({ success: true, message: 'Advisory deleted (archived)', advisory: result.rows[0] });
  } catch (err) {
    console.error('deleteAdvisory error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 6️⃣ Get advisories by location hierarchy
 */
const getAdvisoriesByLocation = async (req, res) => {
  try {
    const { region, zone, woreda, kebele, limit = 20, offset = 0 } = req.query;

    const { whereClause, values, counter } = buildConditions({ region, zone, woreda, kebele });

    const result = await pool.query(
      `SELECT * FROM advisories ${whereClause} 
       ORDER BY urgency DESC, created_at DESC 
       LIMIT $${counter} OFFSET $${counter + 1}`,
      [...values, limit, offset]
    );

    res.json({ success: true, count: result.rowCount, advisories: result.rows });
  } catch (err) {
    console.error('getAdvisoriesByLocation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * 7️⃣ Update advisory urgency only
 */
const updateAdvisoryUrgency = async (req, res) => {
  try {
    const { advisoryId } = req.params;
    const { urgency } = req.body;

    if (!urgency) return res.status(400).json({ message: 'Urgency is required' });

    const result = await pool.query(
      `UPDATE advisories SET urgency = $1, updated_at = NOW() WHERE advisory_id = $2 RETURNING *`,
      [urgency.toUpperCase(), advisoryId]
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Advisory not found' });

    res.json({ success: true, message: 'Advisory urgency updated', advisory: result.rows[0] });
  } catch (err) {
    console.error('updateAdvisoryUrgency error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllAdvisories,
  getAdvisoryById,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
  getAdvisoriesByLocation,
  updateAdvisoryUrgency
};

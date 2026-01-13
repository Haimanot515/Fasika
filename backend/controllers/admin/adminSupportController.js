// controllers/adminSupportController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

/**
 * =========================
 *  Support Management (Admin)
 * =========================
 */

/**
 * ----- FAQs -----
 */

// 1️⃣ Get all FAQs
const getAllFAQs = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await pool.query(
      `SELECT * FROM faqs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({ success: true, count: result.rowCount, faqs: result.rows });
  } catch (err) {
    console.error('getAllFAQs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2️⃣ Get single FAQ by ID
const getFAQById = async (req, res) => {
  try {
    const { faqId } = req.params;
    const result = await pool.query(`SELECT * FROM faqs WHERE faq_id = $1`, [faqId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, faq: result.rows[0] });
  } catch (err) {
    console.error('getFAQById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3️⃣ Create FAQ
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ message: 'Question and Answer required' });

    const faqId = uuidv4();
    const result = await pool.query(
      `INSERT INTO faqs (faq_id, question, answer, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [faqId, question, answer]
    );

    res.status(201).json({ success: true, message: 'FAQ created', faq: result.rows[0] });
  } catch (err) {
    console.error('createFAQ error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4️⃣ Update FAQ
const updateFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer } = req.body;
    if (!question && !answer) return res.status(400).json({ message: 'Nothing to update' });

    const fields = [];
    const values = [];
    let counter = 1;
    if (question) { fields.push(`question = $${counter++}`); values.push(question); }
    if (answer) { fields.push(`answer = $${counter++}`); values.push(answer); }

    values.push(faqId);
    const result = await pool.query(
      `UPDATE faqs SET ${fields.join(', ')}, updated_at = NOW() WHERE faq_id = $${counter} RETURNING *`,
      values
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ updated', faq: result.rows[0] });
  } catch (err) {
    console.error('updateFAQ error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5️⃣ Delete FAQ
const deleteFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    const result = await pool.query(`DELETE FROM faqs WHERE faq_id = $1 RETURNING *`, [faqId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted', faq: result.rows[0] });
  } catch (err) {
    console.error('deleteFAQ error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * ----- Extension Officers -----
 */

// 1️⃣ Get all extension officers
const getAllExtensionOfficers = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await pool.query(
      `SELECT * FROM extension_officers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({ success: true, count: result.rowCount, officers: result.rows });
  } catch (err) {
    console.error('getAllExtensionOfficers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2️⃣ Get single officer by ID
const getExtensionOfficerById = async (req, res) => {
  try {
    const { officerId } = req.params;
    const result = await pool.query(`SELECT * FROM extension_officers WHERE officer_id = $1`, [officerId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Officer not found' });
    res.json({ success: true, officer: result.rows[0] });
  } catch (err) {
    console.error('getExtensionOfficerById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3️⃣ Create extension officer
const createExtensionOfficer = async (req, res) => {
  try {
    const { name, phone, email, region, zone, woreda } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' });

    const officerId = uuidv4();
    const result = await pool.query(
      `INSERT INTO extension_officers (officer_id, name, phone, email, region, zone, woreda, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING *`,
      [officerId, name, phone, email || null, region || null, zone || null, woreda || null]
    );

    res.status(201).json({ success: true, message: 'Officer created', officer: result.rows[0] });
  } catch (err) {
    console.error('createExtensionOfficer error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4️⃣ Update extension officer
const updateExtensionOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;
    const fields = req.body;

    const setClause = [];
    const values = [];
    let counter = 1;
    for (const key in fields) { setClause.push(`${key} = $${counter++}`); values.push(fields[key]); }
    if (!setClause.length) return res.status(400).json({ message: 'No fields to update' });

    values.push(officerId);
    const result = await pool.query(
      `UPDATE extension_officers SET ${setClause.join(', ')}, updated_at = NOW() WHERE officer_id = $${counter} RETURNING *`,
      values
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Officer not found' });
    res.json({ success: true, message: 'Officer updated', officer: result.rows[0] });
  } catch (err) {
    console.error('updateExtensionOfficer error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5️⃣ Delete extension officer
const deleteExtensionOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;
    const result = await pool.query(`DELETE FROM extension_officers WHERE officer_id = $1 RETURNING *`, [officerId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Officer not found' });
    res.json({ success: true, message: 'Officer deleted', officer: result.rows[0] });
  } catch (err) {
    console.error('deleteExtensionOfficer error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * ----- Government Programs -----
 */

// 1️⃣ Get all programs
const getAllGovPrograms = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await pool.query(`SELECT * FROM gov_programs ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    res.json({ success: true, count: result.rowCount, programs: result.rows });
  } catch (err) {
    console.error('getAllGovPrograms error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2️⃣ Get program by ID
const getGovProgramById = async (req, res) => {
  try {
    const { programId } = req.params;
    const result = await pool.query(`SELECT * FROM gov_programs WHERE program_id = $1`, [programId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program: result.rows[0] });
  } catch (err) {
    console.error('getGovProgramById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3️⃣ Create government program
const createGovProgram = async (req, res) => {
  try {
    const { name, description, eligibility, region } = req.body;
    if (!name) return res.status(400).json({ message: 'Program name required' });

    const programId = uuidv4();
    const result = await pool.query(
      `INSERT INTO gov_programs (program_id, name, description, eligibility, region, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING *`,
      [programId, name, description || null, eligibility || null, region || null]
    );

    res.status(201).json({ success: true, message: 'Program created', program: result.rows[0] });
  } catch (err) {
    console.error('createGovProgram error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4️⃣ Update government program
const updateGovProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const fields = req.body;

    const setClause = [];
    const values = [];
    let counter = 1;
    for (const key in fields) { setClause.push(`${key} = $${counter++}`); values.push(fields[key]); }
    if (!setClause.length) return res.status(400).json({ message: 'No fields to update' });

    values.push(programId);
    const result = await pool.query(
      `UPDATE gov_programs SET ${setClause.join(', ')}, updated_at = NOW() WHERE program_id = $${counter} RETURNING *`,
      values
    );

    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program updated', program: result.rows[0] });
  } catch (err) {
    console.error('updateGovProgram error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 5️⃣ Delete government program
const deleteGovProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const result = await pool.query(`DELETE FROM gov_programs WHERE program_id = $1 RETURNING *`, [programId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program deleted', program: result.rows[0] });
  } catch (err) {
    console.error('deleteGovProgram error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  // FAQ
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,

  // Extension Officers
  getAllExtensionOfficers,
  getExtensionOfficerById,
  createExtensionOfficer,
  updateExtensionOfficer,
  deleteExtensionOfficer,

  // Government Programs
  getAllGovPrograms,
  getGovProgramById,
  createGovProgram,
  updateGovProgram,
  deleteGovProgram
};

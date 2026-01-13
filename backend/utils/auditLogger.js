const pool = require('../config/dbConfig'); // <-- this must be 'pool'

async function logAudit({ userId, status, method, ipAddress }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs(user_id, status, method, ip_address, created_at)
       VALUES($1,$2,$3,$4,NOW())`,
      [userId, status, method, ipAddress]
    );
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

module.exports = { logAudit };

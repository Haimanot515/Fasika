// backend/models/user.model.js
const pool = require('../config/dbConfig');

const findUserByPhoneOrEmail = async (identifier, client) => {
    const db = client || pool;
    const query = `
        SELECT *
        FROM users
        WHERE phone = $1 OR email = $1
        LIMIT 1
    `;
    const { rows } = await db.query(query, [identifier]);
    return rows[0];
};

const createUser = async (client, user) => {
    const query = `
        INSERT INTO users (
            user_id, phone, email, password_hash, pin_hash, 
            verification_method, verification_code_hash, 
            verification_expires, verification_attempts, 
            last_otp_sent_at, account_status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `;
    await client.query(query, [
        user.user_id, user.phone, user.email, user.password_hash, 
        user.pin_hash, user.verification_method, user.verification_code_hash, 
        user.verification_expires, user.verification_attempts, 
        user.last_otp_sent_at, user.account_status
    ]);
};

const updateUser = async (userId, fields) => {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    const setClause = keys
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

    const values = [userId, ...Object.values(fields)];

    const query = `
        UPDATE users 
        SET ${setClause} 
        WHERE id = $1 
        RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
};

// EXPORT ALL AT ONCE AT THE END
module.exports = {
    findUserByPhoneOrEmail,
    createUser,
    updateUser
};
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
  // ⚡ NEON OPTIMIZATION:
  max: 5,                   // Reduce max connections to avoid overloading the pooler
  idleTimeoutMillis: 60000, // Wait 60s before closing idle connections
  connectionTimeoutMillis: 20000, // Increase to 20s to allow for slow DNS/Handshake
});

// Handle unexpected errors on idle clients
pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err.message);
});

const testDbConnection = async () => {
  try {
    console.log('⏳ Attempting to connect to Neon...');
    const client = await pool.connect();
    
    const res = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', res.rows[0].now);
    
    client.release(); 
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('👉 Possible fixes: 1. Check your internet. 2. Ensure DATABASE_URL is correct in .env. 3. Check if Neon is in "Suspended" mode.');
  }
};

testDbConnection();

module.exports = pool;
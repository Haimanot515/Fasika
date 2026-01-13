// config/redisConfig.js
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

// Connect using the URL from .env
const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 10000,   // wait up to 10s for connection
  enableOfflineQueue: false, // don't queue commands when disconnected
  autoResubscribe: false,    // don't automatically resubscribe on reconnect
});

// Event listeners
redis.on('ready', () => console.log('✅ Redis ready'));
redis.on('error', (err) => console.error('❌ Redis error:', err));
redis.on('close', () => console.warn('⚠️ Redis connection closed'));

// Export the single instance for reuse
module.exports = redis;

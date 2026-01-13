// utils/rateLimiter.js
const redisClient = require('../config/redisConfig');

async function checkRateLimit({ ipKey, userKey, ipLimit, userLimit }) {
  // Track attempts for IP
  const ipAttempts = await redisClient.incr(ipKey);
  if (ipAttempts === 1) {
    // Set expiry only the first time the key is created
    await redisClient.expire(ipKey, 60 * 15); // 15 minutes
  }
  if (ipAttempts > ipLimit) return false;

  // Track attempts for User
  const userAttempts = await redisClient.incr(userKey);
  if (userAttempts === 1) {
    await redisClient.expire(userKey, 60 * 15);
  }
  if (userAttempts > userLimit) return false;

  return true; // allowed
}

module.exports = { checkRateLimit };

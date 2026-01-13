const redis = require('../config/redisConfig');

async function checkRateLimit({ ipKey, userKey, ipLimit, userLimit, ipExpiry = 60, userExpiry = 300 }) {
  try {
    const ipAttempts = parseInt(await redis.get(ipKey)) || 0;
    const userAttempts = parseInt(await redis.get(userKey)) || 0;

    if (ipAttempts >= ipLimit || userAttempts >= userLimit) return false;

    // Multi command
    await redis.multi()
      .incr(ipKey)
      .expire(ipKey, ipExpiry)
      .incr(userKey)
      .expire(userKey, userExpiry)
      .exec();

    return true;
  } catch (err) {
    console.error('Redis rate limiter failed, falling back to memory:', err.message);
    // Optionally implement in-memory fallback here
    return true; // allow if Redis fails
  }
}

module.exports = { checkRateLimit };

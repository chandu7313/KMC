import { getAuthRedis } from '@kissan/shared';

/**
 * Session repository — stores sessions and OTP data in Redis.
 */
class SessionRepository {
  constructor() {
    this.redis = getAuthRedis();
  }

  // ── Session management ──

  async createSession(userId, token, ttlSeconds = 7 * 24 * 60 * 60) {
    const key = `session:${userId}`;
    await this.redis.set(key, token, 'EX', ttlSeconds);
    return true;
  }

  async getSession(userId) {
    return this.redis.get(`session:${userId}`);
  }

  async deleteSession(userId) {
    return this.redis.del(`session:${userId}`);
  }

  // ── OTP tracking ──

  async storeOtpAttempts(identifier, ttlSeconds = 600) {
    const key = `otp_attempts:${identifier}`;
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, ttlSeconds);
    }
    return current;
  }

  async getOtpAttempts(identifier) {
    const key = `otp_attempts:${identifier}`;
    const attempts = await this.redis.get(key);
    return parseInt(attempts || '0', 10);
  }

  // ── Blacklisted tokens ──

  async blacklistToken(token, ttlSeconds = 7 * 24 * 60 * 60) {
    const key = `blacklist:${token}`;
    await this.redis.set(key, '1', 'EX', ttlSeconds);
  }

  async isTokenBlacklisted(token) {
    const result = await this.redis.get(`blacklist:${token}`);
    return result !== null;
  }
}

export default new SessionRepository();

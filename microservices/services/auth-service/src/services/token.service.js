import { signAccessToken, signRefreshToken } from '@kissan/shared';
import env from '../config/env.js';
import sessionRepository from '../repositories/session.repository.js';

/**
 * Token service — handles JWT creation and cookie management.
 */
class TokenService {
  /**
   * Generate access + refresh tokens for a user.
   * @param {object} user - User object with id and role
   * @returns {{accessToken: string, refreshToken: string}}
   */
  generateTokens(user) {
    const payload = { id: user.id, role: user.role || 'user' };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  /**
   * Set the token cookie on the response.
   * @param {object} res - Express response
   * @param {string} token - JWT token
   */
  setTokenCookie(res, token) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  /**
   * Clear the token cookie.
   * @param {object} res - Express response
   */
  clearTokenCookie(res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'strict',
    });
  }

  /**
   * Store session in Redis.
   * @param {string} userId
   * @param {string} token
   */
  async storeSession(userId, token) {
    await sessionRepository.createSession(userId, token);
  }

  /**
   * Invalidate a session.
   * @param {string} userId
   */
  async invalidateSession(userId) {
    await sessionRepository.deleteSession(userId);
  }
}

export default new TokenService();

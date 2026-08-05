import { signAccessToken, signRefreshToken } from '@kissan/shared';
import env from '../config/env.js';
import sessionRepository from '../repositories/session.repository.js';

/**
 * Token service — handles JWT creation and cookie management.
 */
class TokenService {
  generateTokens(user) {
    const payload = { id: user.id, role: user.role || 'user' };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  setTokenCookie(res, token) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearTokenCookie(res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'strict',
    });
  }

  async storeSession(userId, token) {
    await sessionRepository.createSession(userId, token);
  }

  async invalidateSession(userId) {
    await sessionRepository.deleteSession(userId);
  }
}

export default new TokenService();

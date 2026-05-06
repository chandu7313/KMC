import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Sign a new access token.
 * @param {object} payload - Token payload (must include `id` and `role`)
 * @param {object} [options] - Override options
 * @returns {string} Signed JWT
 */
const signAccessToken = (payload, options = {}) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');

  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      type: 'access',
      ...payload,
    },
    JWT_SECRET,
    {
      expiresIn: options.expiresIn || JWT_EXPIRES_IN,
      issuer: 'kissan-mithar',
      audience: 'kissan-services',
    }
  );
};

/**
 * Sign a refresh token (longer-lived).
 * @param {object} payload
 * @returns {string}
 */
const signRefreshToken = (payload) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');

  return jwt.sign(
    {
      id: payload.id,
      type: 'refresh',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'kissan-mithar',
      audience: 'kissan-services',
    }
  );
};

/**
 * Verify and decode a token.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');

  return jwt.verify(token, JWT_SECRET, {
    issuer: 'kissan-mithar',
    audience: 'kissan-services',
  });
};

/**
 * Decode a token without verification (for logging/debugging).
 * @param {string} token
 * @returns {object|null}
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

export { signAccessToken, signRefreshToken, verifyToken, decodeToken };

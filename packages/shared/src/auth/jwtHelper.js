const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config/src/env');
const { authRedis } = require('../database/redis');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { logger } = require('../logger/winston');

/**
 * Hash a token to create a safe key for Redis storage.
 * 
 * @param {string} token 
 * @returns {string} SHA-256 hash of the token
 */
const _hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Helper to extract TTL in seconds from JWT expiry strings (e.g., '24h', '7d').
 * This is a simplistic implementation; you might use the `ms` package in reality.
 * 
 * @param {string|number} expiresIn 
 * @returns {number} TTL in seconds
 */
const _getTtlSeconds = (expiresIn) => {
  if (typeof expiresIn === 'number') return expiresIn;
  
  const match = String(expiresIn).match(/^(\d+)([smhd])$/);
  if (!match) return 86400; // default 24h

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 86400;
  }
};

/**
 * Generate an Access Token.
 * 
 * @param {Object} payload - User payload containing id, role, name, email
 * @returns {string} Signed JWT Access Token
 */
const generateAccessToken = (payload) => {
  const { id, role, name, email } = payload;
  
  return jwt.sign(
    { id, role, name, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Generate a Refresh Token.
 * 
 * @param {Object} payload - User payload
 * @returns {string} Signed JWT Refresh Token
 */
const generateRefreshToken = (payload) => {
  // Only id and role are typically needed in a refresh token
  const { id, role } = payload;
  
  return jwt.sign(
    { id, role },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

/**
 * Verify an Access Token.
 * Checks the signature and validates it against the Redis blacklist.
 * 
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object>} The decoded token payload
 * @throws {UnauthorizedError} If token is invalid, expired, or blacklisted
 */
const verifyAccessToken = async (token) => {
  try {
    // 1. Verify token signature
    const decoded = jwt.verify(token, config.jwt.secret);

    // 2. Check if token is blacklisted in Redis
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been revoked/logged out');
    }

    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    
    // Format JWT specific errors
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token expired');
    }
    
    throw new UnauthorizedError('Invalid access token');
  }
};

/**
 * Verify a Refresh Token.
 * 
 * @param {string} token - The JWT refresh token
 * @returns {Object} The decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh token expired. Please login again.');
    }
    throw new UnauthorizedError('Invalid refresh token');
  }
};

/**
 * Blacklist a token (e.g., during logout).
 * Stores the hashed token in Redis with a TTL matching the token's remaining life.
 * 
 * @param {string} token - The JWT token to blacklist
 * @param {string} userId - The ID of the user logging out
 * @returns {Promise<void>}
 */
const blacklistToken = async (token, userId) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return; // Can't blacklist invalid token
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const ttlSeconds = decoded.exp - currentTimestamp;

    if (ttlSeconds > 0) {
      const tokenHash = _hashToken(token);
      const redisKey = `auth:blacklist:${tokenHash}`;
      
      await authRedis.setEx(redisKey, ttlSeconds, userId);
      logger.debug(`Token blacklisted for user ${userId}`);
    }
  } catch (error) {
    logger.error(`Failed to blacklist token: ${error.message}`, { error });
    // Don't throw here to prevent blocking logout flows due to cache errors
  }
};

/**
 * Check if a token is in the Redis blacklist.
 * 
 * @param {string} token - The JWT token to check
 * @returns {Promise<boolean>} True if blacklisted
 */
const isTokenBlacklisted = async (token) => {
  try {
    const tokenHash = _hashToken(token);
    const redisKey = `auth:blacklist:${tokenHash}`;
    
    const result = await authRedis.exists(redisKey);
    return result;
  } catch (error) {
    logger.error(`Failed to check token blacklist: ${error.message}`, { error });
    // Fail closed: if we can't check the blacklist, assume it's NOT blacklisted to avoid breaking the system,
    // OR fail open (return true) to be ultra-secure. We'll default to false to prevent system-wide outages if Redis blips.
    return false;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken,
  isTokenBlacklisted,
};

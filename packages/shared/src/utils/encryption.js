const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Hashes a plaintext password using bcrypt.
 * 
 * @param {string} password 
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12); // 12 rounds for good security vs performance
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plaintext password with a bcrypt hash.
 * 
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>} True if they match
 */
const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};

/**
 * Creates a SHA-256 hash of arbitrary data.
 * Useful for token fingerprinting or fast checksums.
 * 
 * @param {string|Buffer} data 
 * @returns {string} Hexadecimal hash
 */
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generates a cryptographically random 6-digit OTP.
 * 
 * @returns {string} The 6-digit OTP
 */
const generateOTP = () => {
  // Generate random number between 100000 and 999999
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
};

/**
 * Generates a highly secure random token.
 * Useful for email verification, password reset, or idempotency keys.
 * 
 * @returns {string} 64-character hex string (32 bytes)
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generates a human-readable reference code.
 * Example: KM-2847, TK-247, INV-2847
 * 
 * @param {string} prefix - The prefix (e.g., 'KM', 'INV')
 * @returns {string} The reference code
 */
const generateRef = (prefix) => {
  // 4 random digits
  const randomNum = crypto.randomInt(1000, 10000);
  return `${prefix.toUpperCase()}-${randomNum}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  hashData,
  generateOTP,
  generateToken,
  generateRef,
};

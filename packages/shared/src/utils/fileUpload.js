const cloudinary = require('cloudinary').v2;
const { logger } = require('../logger/winston');
const config = require('../../config/src/env');

// Configure Cloudinary globally
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.secret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.secret,
  });
} else {
  logger.warn('Cloudinary configuration is incomplete. Uploads will fail.');
}

/**
 * Upload an image to Cloudinary.
 * 
 * @param {Object|string} file - The file path, stream, or base64 string
 * @param {string} folder - The sub-folder inside the main project directory
 * @param {Object} [options={}] - Additional Cloudinary options
 * @returns {Promise<Object>} { url, publicId, format, size }
 */
const uploadImage = async (file, folder, options = {}) => {
  try {
    const uploadOptions = {
      folder: `kissan-mithar/${folder}`,
      resource_type: 'image',
      format: 'webp', // Auto convert to webp for performance
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    logger.error(`Cloudinary image upload failed: ${error.message}`, { error });
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Upload a document (PDF, docx, etc.) to Cloudinary.
 * 
 * @param {Object|string} file - The file path, stream, or base64 string
 * @param {string} folder - The sub-folder
 * @returns {Promise<Object>} { url, publicId, format, size }
 */
const uploadDocument = async (file, folder) => {
  try {
    const uploadOptions = {
      folder: `kissan-mithar/${folder}`,
      resource_type: 'raw', // Use raw for non-image files like PDF
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    logger.error(`Cloudinary document upload failed: ${error.message}`, { error });
    throw new Error('Failed to upload document. Please try again.');
  }
};

/**
 * Delete a file from Cloudinary by its public ID.
 * 
 * @param {string} publicId - The Cloudinary public ID
 * @returns {Promise<boolean>} True if successful
 */
const deleteFile = async (publicId) => {
  try {
    if (!publicId) return false;
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    logger.error(`Cloudinary file deletion failed for ${publicId}: ${error.message}`);
    // Handle gracefully without breaking user flows usually
    return false;
  }
};

/**
 * Generate a transformed Cloudinary URL on the fly.
 * 
 * @param {string} publicId - The Cloudinary public ID
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} The transformed image URL
 */
const generateThumbnail = (publicId, width = 200, height = 200) => {
  if (!publicId) return '';
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    format: 'webp',
  });
};

module.exports = {
  uploadImage,
  uploadDocument,
  deleteFile,
  generateThumbnail,
};

import { successResponse } from '@kissan/shared';
import userService from '../services/user.service.js';

/**
 * User profile controller — thin HTTP layer.
 */

/**
 * Retrieve current user profile, preferences, and associated address records.
 * @route GET /api/users/profile
 * @route POST /api/users/profile
 * @param {import('express').Request} req - Authenticated express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with user data
 */
export const getUserData = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const userData = await userService.getUserData(userId, req.user);
    return successResponse(res, { userData }, 'User data retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile information such as name, phone, district, and crops.
 * @route PUT /api/users/profile
 * @param {import('express').Request} req - Express request with updated profile attributes
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with updated user
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const user = await userService.updateProfile(userId, req.body);
    return successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user's preferred UI language.
 * @route PUT /api/users/language
 * @param {import('express').Request} req - Express request with language code
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON success response
 */
export const updateLanguage = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await userService.updateLanguage(userId, req.body.language);
    return successResponse(res, null, 'Language updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user UI preferences such as tour completion and simple mode.
 * @route PUT /api/users/preferences
 * @param {import('express').Request} req - Express request with preference flags
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON success response
 */
export const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await userService.updatePreferences(userId, req.body);
    return successResponse(res, null, 'Preferences updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Paginated list of users with search and filtering by district, role, and verification status.
 * @route GET /api/users
 * @param {import('express').Request} req - Express request with query params
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON paginated user list
 */
export const listUsers = async (req, res, next) => {
  try {
    const { page, limit, role, search, district, isVerified } = req.query;
    const result = await userService.listUsers({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
      role, search, district,
      isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
    });
    return successResponse(res, result, 'Users retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Get distinct district names where users are registered.
 * @route GET /api/users/districts
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON list of distinct districts
 */
export const getDistricts = async (req, res, next) => {
  try {
    const districts = await userService.getDistricts();
    return successResponse(res, { districts }, 'Districts retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user's system role (Admin only).
 * @route PUT /api/users/:id/role
 * @param {import('express').Request} req - Express request with user ID param and new role
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON response with updated user
 */
export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userService.changeUserRole(id, role);
    return successResponse(res, { user }, 'Role updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate a user account (Admin only).
 * @route DELETE /api/users/:id
 * @param {import('express').Request} req - Express request with user ID param
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Error handler
 * @returns {Promise<import('express').Response>} JSON success response
 */
export const deactivateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deactivateAccount(id);
    return successResponse(res, null, 'Account deactivated');
  } catch (error) {
    next(error);
  }
};

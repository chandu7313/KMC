import { successResponse } from '@kissan/shared';
import userService from '../services/user.service.js';

/**
 * User profile controller — thin HTTP layer.
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

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const user = await userService.updateProfile(userId, req.body);
    return successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateLanguage = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await userService.updateLanguage(userId, req.body.language);
    return successResponse(res, null, 'Language updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    await userService.updatePreferences(userId, req.body);
    return successResponse(res, null, 'Preferences updated successfully');
  } catch (error) {
    next(error);
  }
};

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

export const getDistricts = async (req, res, next) => {
  try {
    const districts = await userService.getDistricts();
    return successResponse(res, { districts }, 'Districts retrieved');
  } catch (error) {
    next(error);
  }
};

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

export const deactivateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deactivateAccount(id);
    return successResponse(res, null, 'Account deactivated');
  } catch (error) {
    next(error);
  }
};

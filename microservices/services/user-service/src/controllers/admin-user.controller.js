import { successResponse } from '@kissan/shared';
import adminUserService from '../services/admin-user.service.js';

export const listAdminUsers = async (req, res, next) => {
  try {
    const { page, limit, role, status } = req.query;
    const result = await adminUserService.listAdminUsers({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
      role, status,
    });
    return successResponse(res, result, 'Admin users retrieved');
  } catch (error) {
    next(error);
  }
};

export const getAdminUser = async (req, res, next) => {
  try {
    const admin = await adminUserService.getAdminUser(req.params.id);
    return successResponse(res, { admin }, 'Admin user retrieved');
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const admin = await adminUserService.createAdminUser(req.body);
    return successResponse(res, { admin }, 'Admin user created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAdminRole = async (req, res, next) => {
  try {
    const admin = await adminUserService.updateAdminRole(req.params.id, req.body.role);
    return successResponse(res, { admin }, 'Admin role updated');
  } catch (error) {
    next(error);
  }
};

export const deactivateAdmin = async (req, res, next) => {
  try {
    await adminUserService.deactivateAdmin(req.params.id);
    return successResponse(res, null, 'Admin user deactivated');
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    await adminUserService.deleteAdmin(req.params.id);
    return successResponse(res, null, 'Admin user deleted');
  } catch (error) {
    next(error);
  }
};

import { successResponse } from '@kissan/shared';
import addressService from '../services/address.service.js';

export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const addresses = await addressService.getAddresses(userId);
    return successResponse(res, { addresses }, 'Addresses retrieved');
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const result = await addressService.addAddress(userId, req.body.address || req.body);
    return successResponse(res, result, 'Address saved successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const address = await addressService.updateAddress(userId, req.params.id, req.body);
    return successResponse(res, { address }, 'Address updated');
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const addresses = await addressService.deleteAddress(userId, req.params.id);
    return successResponse(res, { addresses }, 'Address deleted');
  } catch (error) {
    next(error);
  }
};

import { successResponse } from '@kissan/shared';
import bookingService from '../services/booking.service.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking({ ...req.body, farmerId: req.user?.id || req.body.farmerId });
    return successResponse(res, { booking }, 'Booking created', 201);
  } catch (e) { next(e); }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { bookings: await bookingService.getUserBookings(userId) });
  } catch (e) { next(e); }
};

export const getBookingById = async (req, res, next) => {
  try { return successResponse(res, { booking: await bookingService.getBookingById(req.params.id) }); } catch (e) { next(e); }
};

export const getAllBookings = async (req, res, next) => {
  try { return successResponse(res, await bookingService.getAllBookings(req.query)); } catch (e) { next(e); }
};

export const updateBooking = async (req, res, next) => {
  try { return successResponse(res, { booking: await bookingService.updateBooking(req.params.id, req.body) }); } catch (e) { next(e); }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    return successResponse(res, { booking: await bookingService.cancelBooking(req.params.id, userId) }, 'Cancelled');
  } catch (e) { next(e); }
};

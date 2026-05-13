import { successResponse, paginatedResponse, createdResponse } from '@kissan/shared';
import expertService from '../services/expert.service.js';

// ── Directory ──
export const listExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, specialization, available } = req.query;
    const { experts, total } = await expertService.listExperts({ page, limit, specialization, available });
    return paginatedResponse(res, experts, total, page, limit, 'Experts retrieved successfully');
  } catch (err) { next(err); }
};

export const getExpert = async (req, res, next) => {
  try {
    const result = await expertService.getExpertById(req.params.id);
    return successResponse(res, result, 'Expert profile retrieved');
  } catch (err) { next(err); }
};

export const createExpert = async (req, res, next) => {
  try {
    const expert = await expertService.createExpert({ ...req.body, userId: req.user.id });
    return createdResponse(res, expert, 'Expert profile created');
  } catch (err) { next(err); }
};

export const updateExpert = async (req, res, next) => {
  try {
    const expert = await expertService.updateExpert(req.params.id, req.body, req.user.id);
    return successResponse(res, expert, 'Expert profile updated');
  } catch (err) { next(err); }
};

export const deleteExpert = async (req, res, next) => {
  try {
    await expertService.deleteExpert(req.params.id);
    return successResponse(res, null, 'Expert profile deactivated');
  } catch (err) { next(err); }
};

// ── Bookings ──
export const createBooking = async (req, res, next) => {
  try {
    const booking = await expertService.createBooking({ ...req.body, farmerId: req.user.id });
    return createdResponse(res, booking, 'Booking created successfully');
  } catch (err) { next(err); }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await expertService.getBooking(req.params.id);
    return successResponse(res, booking, 'Booking details retrieved');
  } catch (err) { next(err); }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { bookings, total } = await expertService.getFarmerBookings(req.user.id, { page, limit });
    return paginatedResponse(res, bookings, total, page, limit, 'Your bookings retrieved');
  } catch (err) { next(err); }
};

export const getExpertBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { bookings, total } = await expertService.getExpertBookings(req.params.expertId, { page, limit });
    return paginatedResponse(res, bookings, total, page, limit, 'Expert bookings retrieved');
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await expertService.updateBookingStatus(req.params.id, req.body.status, req.user.id);
    return successResponse(res, booking, `Booking ${req.body.status}`);
  } catch (err) { next(err); }
};

// ── Reviews ──
export const addReview = async (req, res, next) => {
  try {
    const review = await expertService.addReview({ ...req.body, farmerId: req.user.id });
    return createdResponse(res, review, 'Review added successfully');
  } catch (err) { next(err); }
};

export const getExpertReviews = async (req, res, next) => {
  try {
    const reviews = await expertService.getExpertReviews(req.params.expertId);
    return successResponse(res, reviews, 'Expert reviews retrieved');
  } catch (err) { next(err); }
};

// ── Dashboard ──
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await expertService.getDashboardStats(req.params.expertId);
    return successResponse(res, stats, 'Dashboard stats retrieved');
  } catch (err) { next(err); }
};

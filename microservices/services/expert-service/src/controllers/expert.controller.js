import expertService from '../services/expert.service.js';

// ── Directory ──
export const listExperts = async (req, res, next) => {
  try {
    const { page, limit, specialization, available } = req.query;
    const result = await expertService.listExperts({ page, limit, specialization, available });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getExpert = async (req, res, next) => {
  try {
    const result = await expertService.getExpertById(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const createExpert = async (req, res, next) => {
  try {
    const expert = await expertService.createExpert({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, expert });
  } catch (err) { next(err); }
};

export const updateExpert = async (req, res, next) => {
  try {
    const expert = await expertService.updateExpert(req.params.id, req.body, req.user.id);
    res.json({ success: true, expert });
  } catch (err) { next(err); }
};

export const deleteExpert = async (req, res, next) => {
  try {
    await expertService.deleteExpert(req.params.id);
    res.json({ success: true, message: 'Expert profile deactivated' });
  } catch (err) { next(err); }
};

// ── Bookings ──
export const createBooking = async (req, res, next) => {
  try {
    const booking = await expertService.createBooking({ ...req.body, farmerId: req.user.id });
    res.status(201).json({ success: true, booking });
  } catch (err) { next(err); }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await expertService.getBooking(req.params.id);
    res.json({ success: true, booking });
  } catch (err) { next(err); }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await expertService.getFarmerBookings(req.user.id, { page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getExpertBookings = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await expertService.getExpertBookings(req.params.expertId, { page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await expertService.updateBookingStatus(req.params.id, req.body.status, req.user.id);
    res.json({ success: true, booking });
  } catch (err) { next(err); }
};

// ── Reviews ──
export const addReview = async (req, res, next) => {
  try {
    const review = await expertService.addReview({ ...req.body, farmerId: req.user.id });
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
};

export const getExpertReviews = async (req, res, next) => {
  try {
    const reviews = await expertService.getExpertReviews(req.params.expertId);
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

// ── Dashboard ──
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await expertService.getDashboardStats(req.params.expertId);
    res.json({ success: true, ...stats });
  } catch (err) { next(err); }
};

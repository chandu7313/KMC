import { Router } from 'express';
import { authenticate, authorize } from '@kissan/shared';
import {
  listExperts, getExpert, createExpert, updateExpert, deleteExpert,
  createBooking, getBooking, getMyBookings, getExpertBookings, updateBookingStatus,
  addReview, getExpertReviews, getDashboard,
} from '../controllers/expert.controller.js';

const router = Router();

// ── Public: Expert Directory ──
router.get('/', listExperts);
router.get('/:id', getExpert);

// ── Authenticated: Profile Management ──
router.post('/', authenticate, createExpert);
router.patch('/:id', authenticate, updateExpert);
router.delete('/:id', authenticate, authorize('experts:manage'), deleteExpert);

// ── Authenticated: Bookings ──
router.post('/bookings', authenticate, createBooking);
router.get('/bookings/me', authenticate, getMyBookings);
router.get('/bookings/:id', authenticate, getBooking);
router.get('/:expertId/bookings', authenticate, getExpertBookings);
router.patch('/bookings/:id/status', authenticate, updateBookingStatus);

// ── Authenticated: Reviews ──
router.post('/:expertId/reviews', authenticate, addReview);
router.get('/:expertId/reviews', getExpertReviews);

// ── Dashboard ──
router.get('/:expertId/dashboard', authenticate, getDashboard);

export default router;

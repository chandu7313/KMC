import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '@kissan/shared';
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
router.post('/', authMiddleware, createExpert);
router.patch('/:id', authMiddleware, updateExpert);
router.delete('/:id', authMiddleware, adminMiddleware, deleteExpert);

// ── Authenticated: Bookings ──
router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings/me', authMiddleware, getMyBookings);
router.get('/bookings/:id', authMiddleware, getBooking);
router.get('/:expertId/bookings', authMiddleware, getExpertBookings);
router.patch('/bookings/:id/status', authMiddleware, updateBookingStatus);

// ── Authenticated: Reviews ──
router.post('/:expertId/reviews', authMiddleware, addReview);
router.get('/:expertId/reviews', getExpertReviews);

// ── Dashboard ──
router.get('/:expertId/dashboard', authMiddleware, getDashboard);

export default router;

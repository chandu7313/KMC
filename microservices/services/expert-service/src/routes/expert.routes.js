import { Router } from 'express';
import { authenticate, authorize } from '@kissan/shared';
import {
  listExperts, getExpert, createExpert, updateExpert, deleteExpert,
  createBooking, getBooking, getMyBookings, getExpertBookings, updateBookingStatus,
  addReview, getExpertReviews, getDashboard,
} from '../controllers/expert.controller.js';
import {
  getExpertsFromSupabase,
  getExpertProfileFromSupabase,
  bookConsultation,
  getMyConsultations,
  getConsultationNotes,
  cancelConsultation,
  rateConsultation
} from '../controllers/consultation.controller.js';

const router = Router();

// ── NEW: Supabase Consultation Routes ──
// These map to the frontend API calls via Nginx proxy /api/experts/* -> /*
router.get('/', getExpertsFromSupabase);
router.get('/:id/profile', getExpertProfileFromSupabase);
router.post('/book', authenticate, bookConsultation);
router.get('/consultations/my', authenticate, getMyConsultations);
router.get('/consultations/:id/notes', authenticate, getConsultationNotes);
router.put('/consultations/:id/cancel', authenticate, cancelConsultation);
router.post('/consultations/:id/rate', authenticate, rateConsultation);

// ── Legacy: Authenticated Profile Management ──
// router.post('/', authenticate, createExpert);
// router.patch('/:id', authenticate, updateExpert);
// router.delete('/:id', authenticate, authorize('experts:manage'), deleteExpert);

export default router;

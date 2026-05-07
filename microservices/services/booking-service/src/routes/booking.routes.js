import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as bCtrl from '../controllers/booking.controller.js';

const router = express.Router();

// User endpoints
router.post('/create', authenticate, bCtrl.createBooking);
router.post('/user-bookings', authenticate, bCtrl.getUserBookings);
router.get('/:id', authenticate, bCtrl.getBookingById);
router.post('/:id/cancel', authenticate, bCtrl.cancelBooking);

// Admin endpoints
router.get('/', authenticate, authorize(['booking:read']), bCtrl.getAllBookings);
router.put('/:id', authenticate, authorize(['booking:write']), bCtrl.updateBooking);

export default router;

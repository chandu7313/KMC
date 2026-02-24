import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';
import userAuth from '../middleware/userAuth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', userAuth, createBooking);
bookingRouter.post('/user-bookings', userAuth, getUserBookings);

export default bookingRouter;

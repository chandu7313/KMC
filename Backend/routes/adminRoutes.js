import express from 'express';
import { getDashboardStats, getAllUsers, updateUserRole, getFarmers, updateFarmerStatus, updateFarmerInfo, getBookings, updateBooking, sendNotification, getNotifications, getAnalytics, addUser, updateUser, deleteUser } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard-stats', adminAuth, getDashboardStats);
adminRouter.get('/users', adminAuth, getAllUsers);
adminRouter.post('/users', adminAuth, addUser);
adminRouter.put('/users/:id', adminAuth, updateUser);
adminRouter.delete('/users/:id', adminAuth, deleteUser);
adminRouter.post('/update-role', adminAuth, updateUserRole);

// Farmer Management
adminRouter.get('/farmers', adminAuth, getFarmers);
adminRouter.put('/farmer/:id/status', adminAuth, updateFarmerStatus);
adminRouter.put('/farmer/:id', adminAuth, updateFarmerInfo);

// Booking Management
adminRouter.get('/bookings', adminAuth, getBookings);
adminRouter.put('/bookings/:id', adminAuth, updateBooking);

// Notification Management
adminRouter.post('/notifications', adminAuth, sendNotification);
adminRouter.get('/notifications', adminAuth, getNotifications);

// Analytics
adminRouter.get('/analytics', adminAuth, getAnalytics);

export default adminRouter;

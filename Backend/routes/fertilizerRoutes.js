import express from 'express';
import { addFertilizer, listFertilizers, updateFertilizer, deleteFertilizer, placeOrder, getUserOrders, getAdminOrders, updateOrderStatus } from '../controllers/fertilizerController.js';
import upload from '../middleware/uploadMiddleware.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const fertilizerRouter = express.Router();

// Admin Routes
fertilizerRouter.post('/add', adminAuth, upload.single('image'), addFertilizer);
fertilizerRouter.get('/admin-list', adminAuth, listFertilizers);
fertilizerRouter.put('/update/:id', adminAuth, upload.single('image'), updateFertilizer);
fertilizerRouter.delete('/delete/:id', adminAuth, deleteFertilizer);
fertilizerRouter.get('/admin-orders', adminAuth, getAdminOrders);
fertilizerRouter.post('/update-status', adminAuth, updateOrderStatus);

// User Routes
fertilizerRouter.get('/list', listFertilizers);
fertilizerRouter.post('/place-order', userAuth, placeOrder);
fertilizerRouter.get('/user-orders', userAuth, getUserOrders);

export default fertilizerRouter;

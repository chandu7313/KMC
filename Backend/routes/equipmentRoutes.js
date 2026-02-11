import express from 'express';
import { addEquipment, listEquipments, updateEquipment, deleteEquipment, placeEquipmentOrder, getUserEquipmentOrders, getAdminEquipmentOrders, updateEquipmentOrderStatus } from '../controllers/equipmentController.js';
import upload from '../middleware/uploadMiddleware.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const equipmentRouter = express.Router();

// Admin Routes
equipmentRouter.post('/add', adminAuth, upload.single('image'), addEquipment);
equipmentRouter.get('/admin-list', adminAuth, listEquipments);
equipmentRouter.put('/update/:id', adminAuth, upload.single('image'), updateEquipment);
equipmentRouter.delete('/delete/:id', adminAuth, deleteEquipment);
equipmentRouter.get('/admin-orders', adminAuth, getAdminEquipmentOrders);
equipmentRouter.post('/update-status', adminAuth, updateEquipmentOrderStatus);

// User Routes
equipmentRouter.get('/list', listEquipments);
equipmentRouter.post('/place-order', userAuth, placeEquipmentOrder);
equipmentRouter.get('/user-orders', userAuth, getUserEquipmentOrders);

export default equipmentRouter;

import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
// import upload from '../middleware/multer.js'; // Need to check if multer middleware exists

const productRouter = express.Router();

// productRouter.post('/add', adminAuth, upload.array('images', 5), addProduct);
productRouter.post('/add', adminAuth, addProduct); // Simplified for now
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

export default productRouter;

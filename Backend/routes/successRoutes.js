import express from 'express';
import { addSuccessStory, listStories, updateStory, deleteStory, listPublishedStories } from '../controllers/successController.js';
import upload from '../middleware/uploadMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';

const successRouter = express.Router();

// Admin Routes
successRouter.post('/add', adminAuth, upload.single('image'), addSuccessStory);
successRouter.get('/list', adminAuth, listStories);
successRouter.put('/update/:id', adminAuth, upload.single('image'), updateStory);
successRouter.delete('/delete/:id', adminAuth, deleteStory);

// Public Route
successRouter.get('/all', listPublishedStories);

export default successRouter;

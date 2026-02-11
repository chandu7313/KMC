import express from 'express';
import { addBlog, listBlogs, updateBlog, deleteBlog, getBlogBySlug, toggleBlogStatus, listPublishedBlogs } from '../controllers/blogController.js';
import upload from '../middleware/uploadMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';

const blogRouter = express.Router();

// Admin Routes
blogRouter.post('/add', adminAuth, upload.single('image'), addBlog);
blogRouter.get('/list', adminAuth, listBlogs);
blogRouter.put('/update/:id', adminAuth, upload.single('image'), updateBlog);
blogRouter.delete('/delete/:id', adminAuth, deleteBlog);
blogRouter.patch('/status/:id', adminAuth, toggleBlogStatus);

// Public Routes
blogRouter.get('/all', listPublishedBlogs);
blogRouter.get('/get/:slug', getBlogBySlug);

export default blogRouter;

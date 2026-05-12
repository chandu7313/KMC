import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '@kissan/shared';
import {
  listBlogs, getBlogBySlug, getBlogById, createBlog, updateBlog, deleteBlog,
  listStories, getStory, createStory, updateStory, deleteStory,
  listSchemes, getScheme, createScheme, updateScheme,
} from '../controllers/content.controller.js';

const router = Router();

// ── Blogs ──
router.get('/blog/all', listBlogs);
router.get('/blog/get/:slug', getBlogBySlug);
router.get('/blog/:id', getBlogById);
router.post('/blog', authMiddleware, adminMiddleware, createBlog);
router.patch('/blog/:id', authMiddleware, adminMiddleware, updateBlog);
router.delete('/blog/:id', authMiddleware, adminMiddleware, deleteBlog);

// ── Success Stories ──
router.get('/success/all', listStories);
router.get('/success/:id', getStory);
router.post('/success', authMiddleware, adminMiddleware, createStory);
router.patch('/success/:id', authMiddleware, adminMiddleware, updateStory);
router.delete('/success/:id', authMiddleware, adminMiddleware, deleteStory);

// ── Government Schemes ──
router.get('/scheme/all', listSchemes);
router.get('/scheme/:id', getScheme);
router.post('/scheme', authMiddleware, adminMiddleware, createScheme);
router.patch('/scheme/:id', authMiddleware, adminMiddleware, updateScheme);

export default router;

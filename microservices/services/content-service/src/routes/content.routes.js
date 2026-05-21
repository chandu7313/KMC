import { Router } from 'express';
import { authenticate, authorize } from '@kissan/shared';
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
router.post('/blog', authenticate, authorize('content:manage'), createBlog);
router.patch('/blog/:id', authenticate, authorize('content:manage'), updateBlog);
router.delete('/blog/:id', authenticate, authorize('content:manage'), deleteBlog);

// ── Success Stories ──
router.get('/success/all', listStories);
router.get('/success/:id', getStory);
router.post('/success', authenticate, authorize('content:manage'), createStory);
router.patch('/success/:id', authenticate, authorize('content:manage'), updateStory);
router.delete('/success/:id', authenticate, authorize('content:manage'), deleteStory);

// ── Government Schemes ──
router.get('/scheme/all', listSchemes);
router.get('/scheme/:id', getScheme);
router.post('/scheme', authenticate, authorize('content:manage'), createScheme);
router.patch('/scheme/:id', authenticate, authorize('content:manage'), updateScheme);

export default router;

import contentService from '../services/content.service.js';

// ── Blogs ──
export const listBlogs = async (req, res, next) => {
  try {
    const { page, limit, tag, search } = req.query;
    const result = await contentService.listBlogs({ page, limit, tag, search });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await contentService.getBlogBySlug(req.params.slug);
    res.json({ success: true, blog });
  } catch (err) { next(err); }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await contentService.getBlogById(req.params.id);
    res.json({ success: true, blog });
  } catch (err) { next(err); }
};

export const createBlog = async (req, res, next) => {
  try {
    const blog = await contentService.createBlog(req.body);
    res.status(201).json({ success: true, blog });
  } catch (err) { next(err); }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await contentService.updateBlog(req.params.id, req.body);
    res.json({ success: true, blog });
  } catch (err) { next(err); }
};

export const deleteBlog = async (req, res, next) => {
  try {
    await contentService.deleteBlog(req.params.id);
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (err) { next(err); }
};

// ── Success Stories ──
export const listStories = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await contentService.listStories({ page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getStory = async (req, res, next) => {
  try {
    const story = await contentService.getStoryById(req.params.id);
    res.json({ success: true, story });
  } catch (err) { next(err); }
};

export const createStory = async (req, res, next) => {
  try {
    const story = await contentService.createStory(req.body);
    res.status(201).json({ success: true, story });
  } catch (err) { next(err); }
};

export const updateStory = async (req, res, next) => {
  try {
    const story = await contentService.updateStory(req.params.id, req.body);
    res.json({ success: true, story });
  } catch (err) { next(err); }
};

export const deleteStory = async (req, res, next) => {
  try {
    await contentService.deleteStory(req.params.id);
    res.json({ success: true, message: 'Success story deleted' });
  } catch (err) { next(err); }
};

// ── Schemes ──
export const listSchemes = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await contentService.listSchemes({ page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getScheme = async (req, res, next) => {
  try {
    const scheme = await contentService.getSchemeById(req.params.id);
    res.json({ success: true, scheme });
  } catch (err) { next(err); }
};

export const createScheme = async (req, res, next) => {
  try {
    const scheme = await contentService.createScheme(req.body);
    res.status(201).json({ success: true, scheme });
  } catch (err) { next(err); }
};

export const updateScheme = async (req, res, next) => {
  try {
    const scheme = await contentService.updateScheme(req.params.id, req.body);
    res.json({ success: true, scheme });
  } catch (err) { next(err); }
};

import { HttpError, createLogger } from '@kissan/shared';
import contentRepo from '../repositories/content.repository.js';

const logger = createLogger('content-service');

class ContentService {
  // ── Blogs ──
  async listBlogs(filters) {
    return contentRepo.findAllBlogs(filters);
  }

  async getBlogBySlug(slug) {
    const blog = await contentRepo.findBlogBySlug(slug);
    if (!blog) throw HttpError.notFound('Blog post not found');
    return blog;
  }

  async getBlogById(id) {
    const blog = await contentRepo.findBlogById(id);
    if (!blog) throw HttpError.notFound('Blog post not found');
    return blog;
  }

  async createBlog(data) {
    logger.info({ title: data.title }, 'Creating blog post');
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await contentRepo.findBlogBySlug(slug);
    if (existing) throw HttpError.conflict('A blog post with this slug already exists');
    return contentRepo.createBlog({
      title: data.title,
      slug,
      content: data.content,
      author: data.author,
      tags: data.tags || [],
      featured_image: data.featured_image || null,
      is_published: data.is_published ?? false,
    });
  }

  async updateBlog(id, updates) {
    const blog = await contentRepo.findBlogById(id);
    if (!blog) throw HttpError.notFound('Blog post not found');
    const allowed = ['title', 'content', 'author', 'tags', 'featured_image', 'is_published'];
    const fields = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
    if (fields.title && !updates.slug) {
      fields.slug = fields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    return contentRepo.updateBlog(id, { ...fields, updated_at: new Date().toISOString() });
  }

  async deleteBlog(id) {
    const blog = await contentRepo.findBlogById(id);
    if (!blog) throw HttpError.notFound('Blog post not found');
    await contentRepo.deleteBlog(id);
  }

  // ── Success Stories ──
  async listStories(filters) {
    return contentRepo.findAllStories(filters);
  }

  async getStoryById(id) {
    const story = await contentRepo.findStoryById(id);
    if (!story) throw HttpError.notFound('Success story not found');
    return story;
  }

  async createStory(data) {
    logger.info({ farmer: data.farmer_name }, 'Creating success story');
    return contentRepo.createStory({
      farmer_name: data.farmer_name,
      crop: data.crop,
      district: data.district,
      title: data.title,
      headline: data.headline,
      full_story: data.full_story || '',
      image_url: data.image_url || null,
      video_url: data.video_url || null,
      income_increase_pct: data.income_increase_pct || null,
      is_published: data.is_published ?? false,
    });
  }

  async updateStory(id, updates) {
    const story = await contentRepo.findStoryById(id);
    if (!story) throw HttpError.notFound('Success story not found');
    const allowed = ['farmer_name', 'crop', 'district', 'title', 'headline', 'full_story', 'image_url', 'video_url', 'income_increase_pct', 'is_published'];
    const fields = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
    return contentRepo.updateStory(id, fields);
  }

  async deleteStory(id) {
    const story = await contentRepo.findStoryById(id);
    if (!story) throw HttpError.notFound('Success story not found');
    await contentRepo.deleteStory(id);
  }

  // ── Schemes ──
  async listSchemes(filters) {
    return contentRepo.findAllSchemes(filters);
  }

  async getSchemeById(id) {
    const scheme = await contentRepo.findSchemeById(id);
    if (!scheme) throw HttpError.notFound('Scheme not found');
    return scheme;
  }

  async createScheme(data) {
    logger.info({ name: data.name }, 'Creating government scheme');
    return contentRepo.createScheme({
      name: data.name,
      description: data.description,
      eligibility: data.eligibility || '',
      benefits: data.benefits || '',
      apply_url: data.apply_url || null,
      deadline: data.deadline || null,
      is_active: data.is_active ?? true,
    });
  }

  async updateScheme(id, updates) {
    const scheme = await contentRepo.findSchemeById(id);
    if (!scheme) throw HttpError.notFound('Scheme not found');
    const allowed = ['name', 'description', 'eligibility', 'benefits', 'apply_url', 'deadline', 'is_active'];
    const fields = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
    return contentRepo.updateScheme(id, fields);
  }
}

export default new ContentService();

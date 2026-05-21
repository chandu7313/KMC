import { models } from '@kissan/shared';
import { Op } from 'sequelize';

const { Blog, SuccessStory, Scheme } = models;

class ContentRepository {
  // ── Blog Posts ──
  async findAllBlogs({ page = 1, limit = 10, tag, search, isPublished = true } = {}) {
    const where = {};
    if (isPublished) where.is_published = true;
    if (tag) where.tags = { [Op.contains]: [tag] };
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const offset = (page - 1) * limit;

    const { rows, count } = await Blog.findAndCountAll({
      where,
      attributes: ['id', 'title', 'slug', 'author', 'tags', 'featured_image', 'created_at', 'is_published'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { blogs: rows, total: count };
  }

  async findBlogBySlug(slug) {
    return Blog.findOne({ where: { slug }, raw: true });
  }

  async findBlogById(id) {
    return Blog.findByPk(id, { raw: true });
  }

  async createBlog(data) {
    const blog = await Blog.create(data);
    return blog.get({ plain: true });
  }

  async updateBlog(id, updates) {
    const [_, [updatedBlog]] = await Blog.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedBlog;
  }

  async deleteBlog(id) {
    await Blog.destroy({ where: { id } });
  }

  // ── Success Stories ──
  async findAllStories({ page = 1, limit = 10, isPublished = true } = {}) {
    const where = {};
    if (isPublished) where.is_published = true;

    const offset = (page - 1) * limit;

    const { rows, count } = await SuccessStory.findAndCountAll({
      where,
      attributes: ['id', 'farmer_name', 'crop', 'district', 'title', 'headline', 'image_url', 'created_at', 'is_published'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { stories: rows, total: count };
  }

  async findStoryById(id) {
    return SuccessStory.findByPk(id, { raw: true });
  }

  async createStory(data) {
    const story = await SuccessStory.create(data);
    return story.get({ plain: true });
  }

  async updateStory(id, updates) {
    const [_, [updatedStory]] = await SuccessStory.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedStory;
  }

  async deleteStory(id) {
    await SuccessStory.destroy({ where: { id } });
  }

  // ── Schemes ──
  async findAllSchemes({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Scheme.findAndCountAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { schemes: rows, total: count };
  }

  async findSchemeById(id) {
    return Scheme.findByPk(id, { raw: true });
  }

  async createScheme(data) {
    const scheme = await Scheme.create(data);
    return scheme.get({ plain: true });
  }

  async updateScheme(id, updates) {
    const [_, [updatedScheme]] = await Scheme.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedScheme;
  }
}

export default new ContentRepository();

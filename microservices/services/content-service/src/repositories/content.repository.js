import { getSupabaseClient } from '@kissan/shared';

class ContentRepository {
  constructor() { this.db = getSupabaseClient(); }

  // ── Blog Posts ──
  async findAllBlogs({ page = 1, limit = 10, tag, search, isPublished = true } = {}) {
    let q = this.db.from('blog_posts').select('id, title, slug, author, tags, featured_image, created_at, is_published', { count: 'exact' });
    if (isPublished) q = q.eq('is_published', true);
    if (tag) q = q.contains('tags', [tag]);
    if (search) q = q.ilike('title', `%${search}%`);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    q = q.order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    const { data, count, error } = await q;
    if (error) throw error;
    return { blogs: data || [], total: count || 0 };
  }

  async findBlogBySlug(slug) {
    const { data, error } = await this.db.from('blog_posts').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findBlogById(id) {
    const { data, error } = await this.db.from('blog_posts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createBlog(data) {
    const { data: blog, error } = await this.db.from('blog_posts').insert(data).select().single();
    if (error) throw error;
    return blog;
  }

  async updateBlog(id, updates) {
    const { data, error } = await this.db.from('blog_posts').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteBlog(id) {
    const { error } = await this.db.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  }

  // ── Success Stories ──
  async findAllStories({ page = 1, limit = 10, isPublished = true } = {}) {
    let q = this.db
      .from('success_stories')
      .select('id, farmer_name, crop, district, title, headline, image_url, created_at, is_published', { count: 'exact' });
    if (isPublished) q = q.eq('is_published', true);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    q = q.order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    const { data, count, error } = await q;
    if (error) throw error;
    return { stories: data || [], total: count || 0 };
  }

  async findStoryById(id) {
    const { data, error } = await this.db.from('success_stories').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createStory(data) {
    const { data: story, error } = await this.db.from('success_stories').insert(data).select().single();
    if (error) throw error;
    return story;
  }

  async updateStory(id, updates) {
    const { data, error } = await this.db.from('success_stories').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteStory(id) {
    const { error } = await this.db.from('success_stories').delete().eq('id', id);
    if (error) throw error;
  }

  // ── Schemes ──
  async findAllSchemes({ page = 1, limit = 10 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data, count, error } = await this.db.from('schemes')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;
    return { schemes: data || [], total: count || 0 };
  }

  async findSchemeById(id) {
    const { data, error } = await this.db.from('schemes').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createScheme(data) {
    const { data: scheme, error } = await this.db.from('schemes').insert(data).select().single();
    if (error) throw error;
    return scheme;
  }

  async updateScheme(id, updates) {
    const { data, error } = await this.db.from('schemes').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}

export default new ContentRepository();

import { Blog } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';

const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// Add Blog
export const addBlog = async (req, res) => {
    try {
        const { title, excerpt, content, author, status, tags } = req.body;
        const imageFile = req.file;

        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const baseSlug = generateSlug(title);
        let slug = baseSlug;
        
        // Handle slug uniqueness
        let existingBlog = await Blog.findOne({ where: { slug } });
        let counter = 1;
        while (existingBlog) {
            slug = `${baseSlug}-${counter}`;
            existingBlog = await Blog.findOne({ where: { slug } });
            counter++;
        }

        await Blog.create({
            title,
            slug,
            excerpt,
            content,
            author,
            status: status || 'draft',
            tags: tags ? JSON.parse(tags) : [],
            featuredImage: imageUrl,
        });

        res.json({ success: true, message: "Blog Added Successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// List Blogs (Admin)
export const listBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Blog
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, author, status, tags } = req.body;
        const imageFile = req.file;

        const updateData = {
            title,
            excerpt,
            content,
            author,
            status,
            tags: tags ? JSON.parse(tags) : [],
        };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.featuredImage = imageUpload.secure_url;
        }

        const blog = await Blog.findByPk(id);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Only update slug if title changed significantly? Let's keep it simple and just update the provided fields, 
        // to avoid breaking existing links.

        await blog.update(updateData);

        res.json({ success: true, message: "Blog Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findByPk(id);
        if (!blog) {
             return res.json({ success: false, message: "Blog not found" });
        }

        await blog.destroy();

        res.json({ success: true, message: "Blog Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Blog by Slug (Public)
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Get the blog
        const blog = await Blog.findOne({
            where: { slug, status: 'published' }
        });

        if (!blog) return res.json({ success: false, message: "Blog not found" });

        // Increment views
        const updatedViews = (blog.views || 0) + 1;
        await blog.update({ views: updatedViews });
        
        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Toggle Publish Status
export const toggleBlogStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const blog = await Blog.findByPk(id);
        if (!blog) return res.json({ success: false, message: "Blog not found" });

        await blog.update({ status });

        res.json({ success: true, message: `Blog ${status === 'published' ? 'Published' : 'Unpublished'}` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Published Blogs (Public)
export const listPublishedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            where: { status: 'published' },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

import blogModel from "../models/Blog.js";
import { v2 as cloudinary } from 'cloudinary';

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

        const blogData = {
            title,
            excerpt,
            content,
            author,
            status: status || 'draft',
            tags: tags ? JSON.parse(tags) : [],
            featuredImage: imageUrl,
        };

        const blog = new blogModel(blogData);
        await blog.save();

        res.json({ success: true, message: "Blog Added Successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// List Blogs (Admin)
export const listBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find().sort({ createdAt: -1 });
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

        await blogModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Blog Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await blogModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Blog Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Blog by Slug (Public)
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await blogModel.findOneAndUpdate({ slug, status: 'published' }, { $inc: { views: 1 } }, { new: true });

        if (!blog) return res.json({ success: false, message: "Blog not found" });

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
        await blogModel.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: `Blog ${status === 'published' ? 'Published' : 'Unpublished'}` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
// List Published Blogs (Public)
export const listPublishedBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

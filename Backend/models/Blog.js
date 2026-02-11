import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String },
    content: { type: String },
    featuredImage: { type: String },
    author: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
    next();
});

const blogModel = mongoose.models.blog || mongoose.model('blog', blogSchema);

export default blogModel;

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a blog title'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'
    },
    author: {
        type: String,
        default: 'KRC Coffee Team'
    },
    tags: [String],
    isPublished: {
        type: Boolean,
        default: true
    },
    readTime: {
        type: Number, // in minutes
        default: 5
    }
}, { timestamps: true });

// Middleware to create slug from title
blogSchema.pre('save', async function () {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
    }
});

module.exports = mongoose.model('Blog', blogSchema);

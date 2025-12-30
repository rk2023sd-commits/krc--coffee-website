const Blog = require('../models/Blog');
const mongoose = require('mongoose');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort('-createdAt');
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res) => {
    try {
        let blog;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            blog = await Blog.findById(req.params.id);
        } else {
            blog = await Blog.findOne({ slug: req.params.id });
        }

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        await blog.deleteOne();
        res.status(200).json({ success: true, message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

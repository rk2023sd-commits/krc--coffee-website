const Product = require('../models/Product');
const { logEvent } = require('../utils/logger');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort('-createdAt');
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin (for now basic)
exports.createProduct = async (req, res) => {
    try {
        if (req.file) {
            // Cloudinary returns full URL in path, local storage needs construction
            if (req.file.path && (req.file.path.startsWith('http') || req.file.path.startsWith('https'))) {
                req.body.image = req.file.path;
            } else {
                const url = `${req.protocol}://${req.get('host')}`;
                req.body.image = `${url}/uploads/${req.file.filename}`;
            }
        }

        const product = await Product.create(req.body);

        await logEvent('info', `Product Created: ${product.name}`, { productId: product._id }, req.user ? req.user._id : null, req.ip);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (req.file) {
            if (req.file.path && (req.file.path.startsWith('http') || req.file.path.startsWith('https'))) {
                req.body.image = req.file.path;
            } else {
                const url = `${req.protocol}://${req.get('host')}`;
                req.body.image = `${url}/uploads/${req.file.filename}`;
            }
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.deleteOne();

        await logEvent('warning', `Product Deleted: ${product.name}`, { productId: product._id }, req.user ? req.user._id : null, req.ip);

        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

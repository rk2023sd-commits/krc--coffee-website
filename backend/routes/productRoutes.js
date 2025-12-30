const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const upload = require('../middleware/uploadMiddleware');
const reviewRouter = require('./reviewRoutes');

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

router.route('/')
    .get(getProducts)
    .post(upload.single('image'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(upload.single('image'), updateProduct)
    .delete(deleteProduct);

module.exports = router;

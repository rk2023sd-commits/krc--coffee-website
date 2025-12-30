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

router.route('/')
    .get(getProducts)
    .post(upload.single('image'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(upload.single('image'), updateProduct)
    .delete(deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus
} = require('../controllers/orderController');

router.route('/')
    .post(addOrderItems)
    .get(getOrders);

router.route('/myorders/:userId').get(getMyOrders);

router.route('/:id').get(getOrderById);

router.route('/:id/deliver').put(updateOrderToDelivered);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;

const Order = require('../models/Order');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Offer = require('../models/Offer');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest/Auth)
exports.addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            user,
            promoCode // Extract promoCode
        } = req.body;

        // Validation for Promo Code
        let usedOfferId = null;
        if (promoCode) {
            const offer = await Offer.findOne({ code: promoCode.toUpperCase() });

            if (!offer) {
                return res.status(400).json({ message: 'Invalid promo code' });
            }

            if (!offer.isActive || new Date() > new Date(offer.validUntil)) {
                return res.status(400).json({ message: 'Promo code is expired or inactive' });
            }

            if (user) {
                const dbUser = await User.findById(user);
                if (dbUser.usedCoupons && dbUser.usedCoupons.includes(offer._id)) {
                    return res.status(400).json({ message: 'You have already used this coupon' });
                }
                usedOfferId = offer._id;
            }
        }

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                user: user || undefined,
                shippingAddress,
                paymentMethod,
                totalPrice,
                promoCode: promoCode || undefined
            });

            const createdOrder = await order.save();

            // Track used coupon
            if (usedOfferId && user) {
                await User.findByIdAndUpdate(user, {
                    $addToSet: { usedCoupons: usedOfferId }
                });
            }

            // Deduct reward points if redeemed
            if (req.body.redeemedPoints && user) {
                await User.findByIdAndUpdate(user, {
                    $inc: { rewardPoints: -req.body.redeemedPoints }
                });

                // Notification for points deduction
                await Notification.create({
                    user,
                    title: 'Reward Points Used',
                    message: `You used ${req.body.redeemedPoints} points for order #${createdOrder._id.toString().slice(-6).toUpperCase()}.`,
                    type: 'order'
                });
            }


            // Create Notification
            if (user) {
                try {
                    console.log('Generating order notification for user:', user);
                    const notification = await Notification.create({
                        user,
                        title: 'Order Placed!',
                        message: `Your order #${createdOrder._id.toString().slice(-6).toUpperCase()} has been placed successfully.`,
                        type: 'order'
                    });
                    console.log('Notification created:', notification._id);
                } catch (notifErr) {
                    console.error('Failed to create notification:', notifErr.message);
                }
            } else {
                console.log('No user ID provided for notification upon order placement.');
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error('Order creation error:', error);
        // Simplify Mongoose validation errors
        let message = error.message;
        if (error.name === 'ValidationError') {
            message = Object.values(error.errors).map(val => val.message).join(', ');
        }
        res.status(500).json({ message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders/:userId
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();

                // Award Reward Points
                if (order.user) {
                    const pointsToAward = Math.floor(order.totalPrice / 100) * 10;
                    if (pointsToAward > 0) {
                        const user = await User.findById(order.user);
                        if (user) {
                            user.rewardPoints = (user.rewardPoints || 0) + pointsToAward;
                            await user.save();

                            // Create Reward Notification
                            await Notification.create({
                                user: order.user,
                                title: 'Reward Points Earned!',
                                message: `You earned ${pointsToAward} points from your order #${order._id.toString().slice(-6).toUpperCase()}.`,
                                type: 'order'
                            });
                        }
                    }
                }
            }
            const updatedOrder = await order.save();

            // Create Notification
            if (order.user) {
                try {
                    await Notification.create({
                        user: order.user,
                        title: `Order ${status}`,
                        message: `Your order #${order._id.toString().slice(-6).toUpperCase()} is now ${status.toLowerCase()}.`,
                        type: 'order'
                    });
                } catch (notifErr) {
                    console.error('Failed to create status notification:', notifErr.message);
                }
            }


            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
exports.updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'Delivered';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

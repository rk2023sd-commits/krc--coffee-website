const Order = require('../models/Order');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Offer = require('../models/Offer');
const sendEmail = require('../utils/sendEmail');
const Razorpay = require('razorpay');
const Settings = require('../models/Settings');
const { logEvent } = require('../utils/logger');

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay
// @access  Public
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Fetch Razorpay credentials from Settings
        const settings = await Settings.findOne({ type: 'payment' });
        if (!settings || !settings.data || !settings.data.enableRazorpay) {
            return res.status(400).json({ message: 'Razorpay is not enabled' });
        }

        const { razorpayKeyId, razorpayKeySecret } = settings.data;

        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.status(500).json({ message: 'Razorpay keys not configured' });
        }

        const instance = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
        });

        const options = {
            amount: Math.round(amount * 100), // amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await instance.orders.create(options);

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            key_id: razorpayKeyId,
            currency: order.currency
        });
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ message: error.message });
    }
};

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

            // Send Order Confirmation Email (To User if available, or just email in order?)
            // Assuming we only send if we have a user email OR if it was passed in checkout (not implemented yet in model)
            // For now, let's look up the user email if user exists
            if (user) {
                try {
                    const orderUser = await User.findById(user);
                    if (orderUser) {
                        await sendEmail({
                            email: orderUser.email,
                            subject: 'Order Confirmation - KRC! Coffee',
                            message: `<h1>Thank You for Your Order!</h1>
                                      <p>Hi ${orderUser.name},</p>
                                      <p>We have received your order <strong>#${createdOrder._id.toString().slice(-6).toUpperCase()}</strong>.</p>
                                      <p>Total Amount: ₹${createdOrder.totalPrice}</p>
                                      <p>We will notify you once it ships!</p>`
                        });
                    }
                } catch (emailErr) {
                    console.error('Order email failed:', emailErr.message);
                }
            }

            // Log Order
            await logEvent('success', `New Order #${createdOrder._id.toString().slice(-6).toUpperCase()} placed`, { amount: createdOrder.totalPrice }, user || null, req.ip);

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

            // Send Status Update Email
            try {
                const orderUser = await User.findById(order.user);
                if (orderUser) {
                    await sendEmail({
                        email: orderUser.email,
                        subject: `Order Update: ${status} - KRC! Coffee`,
                        message: `<h1>Order Status Update</h1>
                                      <p>Hi ${orderUser.name},</p>
                                      <p>Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> status has been updated to: <strong>${status}</strong>.</p>
                                      ${status === 'Delivered' ? '<p>Thank you for shopping with us! We hope you enjoy your coffee.</p>' : ''}
                                      <p>If you have any questions, please reply to this email.</p>`
                    });
                }
            } catch (emailErr) {
                console.error('Status update email failed:', emailErr.message);
            }

            // Log Status Update
            await logEvent('info', `Order #${order._id.toString().slice(-6).toUpperCase()} status updated to ${status}`, {}, req.user ? req.user._id : null, req.ip);

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

            // Send Delivered Email
            if (order.user) {
                try {
                    const orderUser = await User.findById(order.user);
                    if (orderUser) {
                        await sendEmail({
                            email: orderUser.email,
                            subject: 'Order Delivered - KRC! Coffee',
                            message: `<h1>Your Order has been Delivered!</h1>
                                      <p>Hi ${orderUser.name},</p>
                                      <p>Good news! Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been delivered.</p>
                                      <p>Thank you for choosing KRC! Coffee.</p>`
                        });
                    }
                } catch (emailErr) {
                    console.error('Delivered email failed:', emailErr.message);
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

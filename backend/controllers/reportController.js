const Order = require('../models/Order');

// @desc    Get Sales Report
// @route   GET /api/reports/sales
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Delivered' });

        const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const totalOrders = orders.length;

        // Group by date (simplified)
        const salesByDate = orders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!acc[date]) acc[date] = 0;
            acc[date] += order.totalPrice;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            totalSales,
            totalOrders,
            salesByDate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Revenue Report
// @route   GET /api/reports/revenue
// @access  Private/Admin
exports.getRevenueReport = async (req, res) => {
    try {
        // Assuming revenue is same as total sales for now, but in real app might check payment status
        const orders = await Order.find({ status: { $ne: 'Cancelled' } }); // Include all pending/delivered

        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        // Calculate monthly revenue
        const revenueByMonth = orders.reduce((acc, order) => {
            const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[month]) acc[month] = 0;
            acc[month] += order.totalPrice;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            totalRevenue,
            revenueByMonth
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Product Performance Report
// @route   GET /api/reports/performance
// @access  Private/Admin
exports.getProductPerformance = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'Cancelled' } });
        const productStats = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!productStats[item.name]) {
                    productStats[item.name] = {
                        name: item.name,
                        quantitySold: 0,
                        revenueGenerated: 0
                    };
                }
                productStats[item.name].quantitySold += item.quantity;
                productStats[item.name].revenueGenerated += (item.price * item.quantity);
            });
        });

        // Convert to array and sort by quantity sold
        const topProducts = Object.values(productStats).sort((a, b) => b.quantitySold - a.quantitySold);

        res.status(200).json({
            success: true,
            data: topProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

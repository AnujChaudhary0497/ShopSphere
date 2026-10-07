const Order = require("../models/order.model");

// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [["created_at", "DESC"]]
        });

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// Get Order By ID
const getOrderById = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// Create Order
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            totalAmount,
            status,
            paymentStatus,
            paymentMethod,
            shippingAddress
        } = req.body;

        const order = await Order.create({
            userId,
            totalAmount,
            status: status || "pending",
            paymentStatus: paymentStatus || "pending",
            paymentMethod: paymentMethod || "cod",
            shippingAddress
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};


// Update Order
const updateOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const {
            totalAmount,
            status,
            paymentStatus,
            paymentMethod,
            shippingAddress
        } = req.body;

        await order.update({
            totalAmount: totalAmount ?? order.totalAmount,
            status: status ?? order.status,
            paymentStatus:
                paymentStatus ?? order.paymentStatus,
            paymentMethod:
                paymentMethod ?? order.paymentMethod,
            shippingAddress:
                shippingAddress ?? order.shippingAddress
        });

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update order",
            error: error.message
        });
    }
};


// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.id);

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await order.destroy();

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete order",
            error: error.message
        });
    }
};


module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
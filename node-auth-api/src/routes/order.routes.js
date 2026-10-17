const express = require("express");

const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/permission.middleware");

const router = express.Router();

// Get All Orders
router.get(
    "/",
    authMiddleware,
    checkPermission("orders", "read"),
    getOrders
);

// Get Order By ID
router.get(
    "/:id",
    authMiddleware,
    checkPermission("orders", "read"),
    getOrderById
);

// Create Order
router.post(
    "/",
    authMiddleware,
    checkPermission("orders", "create"),
    createOrder
);

// Update Order
router.put(
    "/:id",
    authMiddleware,
    checkPermission("orders", "update"),
    updateOrder
);

// Delete Order
router.delete(
    "/:id",
    authMiddleware,
    checkPermission("orders", "delete"),
    deleteOrder
);

module.exports = router;
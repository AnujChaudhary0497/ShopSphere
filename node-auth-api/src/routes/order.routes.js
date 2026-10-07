const express = require("express");

const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/role.middleware");

const router = express.Router();


// Get All Orders
router.get(
    "/",
    authMiddleware,
    adminOnly,
    getOrders
);


// Get Order By ID
router.get(
    "/:id",
    authMiddleware,
    adminOnly,
    getOrderById
);


// Create Order
router.post(
    "/",
    authMiddleware,
    adminOnly,
    createOrder
);


// Update Order
router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    updateOrder
);


// Delete Order
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteOrder
);


module.exports = router;
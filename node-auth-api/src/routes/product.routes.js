const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/role.middleware");

const router = express.Router();


// Get All Products
router.get(
    "/",
    authMiddleware,
    adminOnly,
    getProducts
);


// Get Product By ID
router.get(
    "/:id",
    authMiddleware,
    adminOnly,
    getProductById
);


// Create Product
router.post(
    "/",
    authMiddleware,
    adminOnly,
    createProduct
);


// Update Product
router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    updateProduct
);


// Delete Product
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteProduct
);


module.exports = router;
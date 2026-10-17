const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/permission.middleware");

const router = express.Router();

// Get All Products
router.get(
  "/",
  authMiddleware,
  checkPermission("products", "read"),
  getProducts,
);

// Get Product By ID
router.get(
  "/:id",
  authMiddleware,
  checkPermission("products", "read"),
  getProductById,
);

// Create Product
router.post(
  "/",
  authMiddleware,
  checkPermission("products", "create"),
  createProduct,
);

// Update Product
router.put(
  "/:id",
  authMiddleware,
  checkPermission("products", "update"),
  updateProduct,
);

// Delete Product
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("products", "delete"),
  deleteProduct,
);

module.exports = router;

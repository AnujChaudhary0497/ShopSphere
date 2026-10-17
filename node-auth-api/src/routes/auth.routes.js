const express = require("express");

const {
  register,
  login,
  getAllUsers,
  getUser,
  updateUserProfile,
  updatePassword,
  updateUser,
  toggleStatus,
  removeUser,
  forgotPasswordRequest,
  validateResetPasswordToken,
  resetPasswordRequest,
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

const validate = require("../middlewares/validate");

const authMiddleware = require("../middlewares/auth.middleware");

const adminOnly = require("../middlewares/role.middleware");

const checkPermission = require("../middlewares/permission.middleware");

const router = express.Router();

// =========================
// Authentication
// =========================

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

// =========================
// Password Reset
// =========================

router.post("/forgot-password", forgotPasswordRequest);

router.get("/validate-reset-token", validateResetPasswordToken);

router.post("/reset-password", resetPasswordRequest);

// =========================
// Admin User Management
// =========================

router.get(
  "/users",
  authMiddleware,
  checkPermission("users", "read"),
  getAllUsers,
);

router.get(
  "/users/:id",
  authMiddleware,
  checkPermission("users", "read"),
  getUser,
);

router.put(
  "/users/:id",
  authMiddleware,
  checkPermission("users", "update"),
  updateUser,
);

router.patch(
  "/users/:id/status",
  authMiddleware,
  checkPermission("users", "update"),
  toggleStatus,
);

router.delete(
  "/users/:id",
  authMiddleware,
  checkPermission("users", "delete"),
  removeUser,
);

// =========================
// Logged-in User
// =========================

router.put("/profile", authMiddleware, updateUserProfile);

router.put("/change-password", authMiddleware, updatePassword);

module.exports = router;

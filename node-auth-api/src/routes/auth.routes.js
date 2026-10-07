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
    resetPasswordRequest
} = require("../controllers/auth.controller");

const {
    registerValidator,
    loginValidator
} = require("../validators/auth.validator");

const validate = require("../middlewares/validate");

const authMiddleware =
    require("../middlewares/auth.middleware");

const adminOnly =
    require("../middlewares/role.middleware");


const router = express.Router();


// =========================
// Authentication
// =========================

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);


// =========================
// Password Reset
// =========================

router.post(
    "/forgot-password",
    forgotPasswordRequest
);

router.get(
    "/validate-reset-token",
    validateResetPasswordToken
);

router.post(
    "/reset-password",
    resetPasswordRequest
);


// =========================
// Admin User Management
// =========================

router.get(
    "/users",
    authMiddleware,
    adminOnly,
    getAllUsers
);

router.get(
    "/users/:id",
    authMiddleware,
    adminOnly,
    getUser
);

router.put(
    "/users/:id",
    authMiddleware,
    adminOnly,
    updateUser
);

router.patch(
    "/users/:id/status",
    authMiddleware,
    adminOnly,
    toggleStatus
);

router.delete(
    "/users/:id",
    authMiddleware,
    adminOnly,
    removeUser
);


// =========================
// Logged-in User
// =========================

router.put(
    "/profile",
    authMiddleware,
    updateUserProfile
);

router.put(
    "/change-password",
    authMiddleware,
    updatePassword
);


module.exports = router;
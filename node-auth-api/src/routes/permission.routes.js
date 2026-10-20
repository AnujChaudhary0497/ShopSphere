const express = require("express");

const {
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
} = require("../controllers/permission.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/permission.middleware");

const router = express.Router();

// Get all permissions
router.get(
    "/",
    authMiddleware,
    checkPermission("permissions", "read"),
    getAllPermissions
);

// Create permission
router.post(
    "/",
    authMiddleware,
    checkPermission("permissions", "create"),
    createPermission
);

// Update permission
router.put(
    "/:id",
    authMiddleware,
    checkPermission("permissions", "update"),
    updatePermission
);

// Delete permission
router.delete(
    "/:id",
    authMiddleware,
    checkPermission("permissions", "delete"),
    deletePermission
);

module.exports = router;
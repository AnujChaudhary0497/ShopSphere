const express = require("express");

const {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
    assignRoleToUser,
} = require("../controllers/role.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/permission.middleware");

const router = express.Router();

// Get all roles
router.get(
    "/",
    authMiddleware,
    checkPermission("roles", "read"),
    getAllRoles
);

// Create role
router.post(
    "/",
    authMiddleware,
    checkPermission("roles", "create"),
    createRole
);

// Update role
router.put(
    "/:id",
    authMiddleware,
    checkPermission("roles", "update"),
    updateRole
);

// Delete role
router.delete(
    "/:id",
    authMiddleware,
    checkPermission("roles", "delete"),
    deleteRole
);

// Assign permissions to a role
router.put(
    "/:id/permissions",
    authMiddleware,
    checkPermission("roles", "update"),
    assignPermissions
);

// Assign role to a user
router.put(
    "/assign-user",
    authMiddleware,
    checkPermission("roles", "update"),
    assignRoleToUser
);

module.exports = router;
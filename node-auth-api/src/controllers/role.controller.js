const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
const User = require("../models/user.model");

// System roles that cannot be renamed or deleted
const protectedRoles = [
    "super_admin",
    "admin",
    "manager",
    "editor",
    "support",
    "user",
    "inventory_manager",
];

// GET ALL ROLES
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: [
                {
                    model: Permission,
                    as: "permissions",
                    through: { attributes: [] },
                },
            ],
            order: [["id", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            count: roles.length,
            data: roles,
        });
    } catch (error) {
        console.error("Get roles error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch roles",
        });
    }
};

// CREATE ROLE
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Role name is required",
            });
        }

        const normalizedName = name.trim().toLowerCase();

        if (protectedRoles.includes(normalizedName)) {
            return res.status(409).json({
                success: false,
                message: "This role is reserved for the system",
            });
        }

        const existingRole = await Role.findOne({
            where: { name: normalizedName },
        });

        if (existingRole) {
            return res.status(409).json({
                success: false,
                message: "Role already exists",
            });
        }

        const role = await Role.create({
            name: normalizedName,
            description: description?.trim() || null,
        });

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    } catch (error) {
        console.error("Create role error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create role",
        });
    }
};

// UPDATE ROLE
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        const currentName = role.name.toLowerCase();

        if (protectedRoles.includes(currentName)) {
            return res.status(403).json({
                success: false,
                message: "System roles cannot be modified",
            });
        }

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Role name cannot be empty",
                });
            }

            const normalizedName = name.trim().toLowerCase();

            if (protectedRoles.includes(normalizedName)) {
                return res.status(409).json({
                    success: false,
                    message: "This role name is reserved for the system",
                });
            }

            const existingRole = await Role.findOne({
                where: { name: normalizedName },
            });

            if (existingRole && existingRole.id !== role.id) {
                return res.status(409).json({
                    success: false,
                    message: "Role name already exists",
                });
            }

            role.name = normalizedName;
        }

        if (description !== undefined) {
            if (
                description !== null &&
                typeof description !== "string"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be a string or null",
                });
            }

            role.description = description?.trim() || null;
        }

        await role.save();

        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    } catch (error) {
        console.error("Update role error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update role",
        });
    }
};

// DELETE ROLE
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        if (protectedRoles.includes(role.name.toLowerCase())) {
            return res.status(403).json({
                success: false,
                message: "System roles cannot be deleted",
            });
        }

        // Prevent deletion when users are assigned to this role
        const assignedUsers = await User.count({
            where: { roleId: role.id },
        });

        if (assignedUsers > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete this role because ${assignedUsers} user(s) are assigned to it`,
            });
        }

        // Remove role-permission associations first
        await role.setPermissions([]);

        await role.destroy();

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    } catch (error) {
        console.error("Delete role error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete role",
        });
    }
};

// ASSIGN PERMISSIONS TO ROLE
const assignPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissionIds } = req.body;

        if (!Array.isArray(permissionIds)) {
            return res.status(400).json({
                success: false,
                message: "permissionIds must be an array",
            });
        }

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        const uniquePermissionIds = [...new Set(permissionIds)];

        const permissions = await Permission.findAll({
            where: {
                id: uniquePermissionIds,
            },
        });

        if (permissions.length !== uniquePermissionIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permission IDs are invalid",
            });
        }

        await role.setPermissions(permissions);

        return res.status(200).json({
            success: true,
            message: "Permissions assigned successfully",
            data: {
                roleId: role.id,
                roleName: role.name,
                permissionIds: permissions.map(
                    (permission) => permission.id
                ),
            },
        });
    } catch (error) {
        console.error("Assign permissions error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to assign permissions",
        });
    }
};

// ASSIGN ROLE TO USER
const assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            return res.status(400).json({
                success: false,
                message: "userId and roleId are required",
            });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const role = await Role.findByPk(roleId);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        await user.update({
            roleId: role.id,
        });

        return res.status(200).json({
            success: true,
            message: "Role assigned successfully",
            data: {
                userId: user.id,
                roleId: role.id,
                roleName: role.name,
            },
        });
    } catch (error) {
        console.error("Assign role error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to assign role",
        });
    }
};

module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
    assignRoleToUser,
};
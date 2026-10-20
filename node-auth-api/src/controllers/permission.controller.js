const Permission = require("../models/permission.model");
const RolePermission = require("../models/rolePermission.model");

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            order: [["id", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            count: permissions.length,
            data: permissions,
        });
    } catch (error) {
        console.error("Get permissions error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch permissions",
        });
    }
};

const createPermission = async (req, res) => {
    try {
        const { resource, action, description } = req.body;

        if (!resource || !action) {
            return res.status(400).json({
                success: false,
                message: "Resource and action are required",
            });
        }

        const normalizedResource = resource.trim().toLowerCase();
        const normalizedAction = action.trim().toLowerCase();

        const allowedActions = ["create", "read", "update", "delete"];

        if (!allowedActions.includes(normalizedAction)) {
            return res.status(400).json({
                success: false,
                message: "Action must be create, read, update, or delete",
            });
        }

        const name = `${normalizedResource}.${normalizedAction}`;

        const existing = await Permission.findOne({
            where: { name },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Permission already exists",
            });
        }

        const permission = await Permission.create({
            name,
            resource: normalizedResource,
            action: normalizedAction,
            description: description?.trim() || null,
        });

        return res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission,
        });
    } catch (error) {
        console.error("Create permission error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create permission",
        });
    }
};

const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { resource, action, description } = req.body;

        const permission = await Permission.findByPk(id);

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        const normalizedResource =
            resource !== undefined
                ? resource.trim().toLowerCase()
                : permission.resource;

        const normalizedAction =
            action !== undefined
                ? action.trim().toLowerCase()
                : permission.action;

        const allowedActions = ["create", "read", "update", "delete"];

        if (!normalizedResource || !allowedActions.includes(normalizedAction)) {
            return res.status(400).json({
                success: false,
                message: "Valid resource and action are required",
            });
        }

        const name = `${normalizedResource}.${normalizedAction}`;

        const duplicate = await Permission.findOne({
            where: { name },
        });

        if (duplicate && duplicate.id !== permission.id) {
            return res.status(409).json({
                success: false,
                message: "Another permission with this name already exists",
            });
        }

        await permission.update({
            name,
            resource: normalizedResource,
            action: normalizedAction,
            description:
                description !== undefined
                    ? description?.trim() || null
                    : permission.description,
        });

        return res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: permission,
        });
    } catch (error) {
        console.error("Update permission error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update permission",
        });
    }
};

const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;

        const permission = await Permission.findByPk(id);

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }

        await RolePermission.destroy({
            where: { permissionId: permission.id },
        });

        await permission.destroy();

        return res.status(200).json({
            success: true,
            message: "Permission deleted successfully",
        });
    } catch (error) {
        console.error("Delete permission error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete permission",
        });
    }
};

module.exports = {
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
};
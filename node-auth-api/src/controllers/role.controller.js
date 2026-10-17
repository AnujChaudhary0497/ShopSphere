const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

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

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const allowedRoles = [
      "super_admin",
      "admin",
      "manager",
      "editor",
      "support",
      "user",
    ];

    if (allowedRoles.includes(name.trim().toLowerCase())) {
      return res.status(409).json({
        success: false,
        message: "This role already exists in the predefined role list",
      });
    }

    const existingRole = await Role.findOne({
      where: { name: name.trim().toLowerCase() },
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    const role = await Role.create({
      name: name.trim().toLowerCase(),
      description: description || null,
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

        const permissions = await Permission.findAll({
            where: {
                id: permissionIds,
            },
        });

        if (permissions.length !== new Set(permissionIds).size) {
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
                permissionIds: permissions.map((permission) => permission.id),
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

const assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            return res.status(400).json({
                success: false,
                message: "userId and roleId are required",
            });
        }

        const User = require("../models/user.model");

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
    assignPermissions,
    assignRoleToUser,
};
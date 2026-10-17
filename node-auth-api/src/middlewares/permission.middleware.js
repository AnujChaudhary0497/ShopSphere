const { Role, Permission } = require("../models/associations");

const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = await Role.findByPk(req.user.roleId);

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Role not assigned",
        });
      }

      // Super Admin has full access
      if (userRole.name === "super_admin") {
        return next();
      }

      const permission = await Permission.findOne({
        where: {
          resource,
          action,
        },
        include: [
          {
            model: Role,
            as: "roles",
            where: {
              id: userRole.id,
            },
            through: {
              attributes: [],
            },
            required: true,
          },
        ],
      });

      if (!permission) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      return next();
    } catch (error) {
      console.error("Permission middleware error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to verify permissions",
      });
    }
  };
};

module.exports = checkPermission;

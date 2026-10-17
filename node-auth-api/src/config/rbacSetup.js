const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
const RolePermission = require("../models/rolePermission.model");

require("../models/associations");

const setupRBAC = async () => {
  // Create tables if missing
  await Role.sync();
  await Permission.sync();
  await RolePermission.sync();

  // Define CRUD permissions
  const resources = [
    "users",
    "products",
    "orders",
    "dashboard",
    "notifications",
    "roles",
    "permissions",
  ];

  const actions = ["create", "read", "update", "delete"];

  for (const resource of resources) {
    for (const action of actions) {
      const name = `${resource}.${action}`;

      await Permission.findOrCreate({
        where: { name },
        defaults: {
          name,
          resource,
          action,
          description: `${action} ${resource}`,
        },
      });
    }
  }

  // Get roles and permissions
  const roles = await Role.findAll();
  const permissions = await Permission.findAll();

  for (const role of roles) {
    let allowedPermissions = [];

    switch (role.name) {
      case "super_admin":
      case "admin":
        allowedPermissions = permissions;
        break;

      case "manager":
        allowedPermissions = permissions.filter(
          (p) => p.resource !== "permissions",
        );
        break;

      case "editor":
        allowedPermissions = permissions.filter(
          (p) =>
            ["products"].includes(p.resource) &&
            ["create", "read", "update"].includes(p.action),
        );
        break;

      case "support":
        allowedPermissions = permissions.filter(
          (p) =>
            ["orders", "users"].includes(p.resource) && p.action === "read",
        );
        break;

      case "user":
        allowedPermissions = permissions.filter(
          (p) => ["products"].includes(p.resource) && p.action === "read",
        );
        break;
    }

    for (const permission of allowedPermissions) {
      await RolePermission.findOrCreate({
        where: {
          roleId: role.id,
          permissionId: permission.id,
        },
        defaults: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log("RBAC permissions and assignments created successfully.");
};

module.exports = setupRBAC;

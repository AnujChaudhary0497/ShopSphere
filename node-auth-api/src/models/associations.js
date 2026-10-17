const User = require("./user.model");
const Role = require("./role.model");
const Permission = require("./permission.model");
const RolePermission = require("./rolePermission.model");

// User belongs to one role
Role.hasMany(User, {
    foreignKey: "roleId",
    as: "users",
});

User.belongsTo(Role, {
    foreignKey: "roleId",
    as: "assignedRole",
});

// Roles and permissions: many-to-many
Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions",
});

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles",
});

// Join-table associations
RolePermission.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role",
});

RolePermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permission",
});

module.exports = {
    User,
    Role,
    Permission,
    RolePermission,
};
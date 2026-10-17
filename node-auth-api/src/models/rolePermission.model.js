const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RolePermission = sequelize.define(
    "RolePermission",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        permissionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "role_permissions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                unique: true,
                fields: ["roleId", "permissionId"],
            },
        ],
    }
);

module.exports = RolePermission;
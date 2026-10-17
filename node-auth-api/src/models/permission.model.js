const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Permission = sequelize.define(
    "Permission",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        resource: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        action: {
            type: DataTypes.ENUM(
                "create",
                "read",
                "update",
                "delete"
            ),
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: "permissions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Permission;
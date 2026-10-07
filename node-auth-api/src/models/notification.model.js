const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM(
                "user",
                "product",
                "order",
                "system"
            ),
            defaultValue: "system",
            allowNull: false,
        },

        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "notifications",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Notification;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
    "Order",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ),
            defaultValue: "pending",
            allowNull: false
        },

        paymentStatus: {
            type: DataTypes.ENUM(
                "pending",
                "paid",
                "failed"
            ),
            defaultValue: "pending",
            allowNull: false
        },

        paymentMethod: {
            type: DataTypes.ENUM(
                "cod",
                "online"
            ),
            defaultValue: "cod",
            allowNull: false
        },

        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: "orders",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Order;
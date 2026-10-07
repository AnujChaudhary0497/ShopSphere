const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },

    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    sizes: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    colors: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Product;

const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();

    const orders = await Order.findAll({
      attributes: ["id", "totalAmount"],
      order: [["created_at", "DESC"]],
    });

    console.log("Dashboard Orders:", orders.length);
    console.log("Dashboard Order Data:", orders);

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((total, order) => {
      return total + Number(order.totalAmount || 0);
    }, 0);

    const recentUsers = await User.findAll({
      attributes: ["id", "name", "email", "role", "isActive", "created_at"],
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    const recentProducts = await Product.findAll({
      attributes: [
        "id",
        "name",
        "brand",
        "category",
        "finalPrice",
        "stock",
        "rating",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentUsers,
        recentProducts,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};

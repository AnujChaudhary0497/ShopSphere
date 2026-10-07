require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/database");

const User = require("./models/user.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");
const Notification = require("./models/notification.model");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  await User.sync();
  console.log("User table created successfully");

  await Product.sync();
  console.log("Product table created successfully");

  await Order.sync();
  console.log("Order table created successfully");

  await Notification.sync();
  console.log("Notification table created successfully");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

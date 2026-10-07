const cors = require("cors");
const express = require("express");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const orderRoutes = require("./routes/order.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Node Auth API is running",
  });
});

module.exports = app;

const express = require("express");

const { getDashboardStats } = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkPermission = require("../middlewares/permission.middleware");

const router = express.Router();

router.get(
    "/stats",
    authMiddleware,
    checkPermission("dashboard", "read"),
    getDashboardStats
);

module.exports = router;
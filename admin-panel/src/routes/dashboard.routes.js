const express = require("express");

const {
    getDashboardStats
} = require("../controllers/dashboard.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
    "/stats",
    authMiddleware,
    adminOnly,
    getDashboardStats
);

module.exports = router;
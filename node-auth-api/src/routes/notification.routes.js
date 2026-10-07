const express = require("express");

const {
  create,
  getAll,
  getUnread,
  getCount,
  markRead,
  markAllRead,
  remove,
} = require("../controllers/notification.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/role.middleware");

const router = express.Router();

// =========================
// Create Notification
// =========================

router.post("/", authMiddleware, adminOnly, create);

// =========================
// Get All Notifications
// =========================

router.get("/", authMiddleware, adminOnly, getAll);

// =========================
// Get Unread Notifications
// =========================

router.get("/unread", authMiddleware, adminOnly, getUnread);

// =========================
// Get Unread Count
// =========================

router.get("/unread-count", authMiddleware, adminOnly, getCount);

// =========================
// Mark All As Read
// =========================

router.patch("/read-all", authMiddleware, adminOnly, markAllRead);

// =========================
// Mark Single Notification As Read
// =========================

router.patch("/:id/read", authMiddleware, adminOnly, markRead);

// =========================
// Delete Notification
// =========================

router.delete("/:id", authMiddleware, adminOnly, remove);

module.exports = router;

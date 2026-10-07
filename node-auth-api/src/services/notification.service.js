const Notification = require("../models/notification.model");
const { Op } = require("sequelize");

// =========================
// Create Notification
// =========================

const createNotification = async ({
  title,
  message,
  type = "system",
  userId = null,
}) => {
  const notification = await Notification.create({
    title,
    message,
    type,
    userId,
  });

  return notification;
};

// =========================
// Get All Notifications
// =========================

const getNotifications = async (userId = null) => {
  let whereCondition = {};

  /*
        If userId is provided:

        Show:
        1. Global notifications -> userId = null
        2. User-specific notifications -> userId = current user
    */

  if (userId !== null) {
    whereCondition = {
      [Op.or]: [
        {
          userId: null,
        },
        {
          userId: userId,
        },
      ],
    };
  }

  const notifications = await Notification.findAll({
    where: whereCondition,
    order: [["created_at", "DESC"]],
  });

  return notifications;
};

// =========================
// Get Unread Notifications
// =========================

const getUnreadNotifications = async (userId = null) => {
  let whereCondition = {
    isRead: false,
  };

  /*
        Show unread:
        1. Global notifications
        2. User-specific notifications
    */

  if (userId !== null) {
    whereCondition = {
      isRead: false,

      [Op.or]: [
        {
          userId: null,
        },
        {
          userId: userId,
        },
      ],
    };
  }

  const notifications = await Notification.findAll({
    where: whereCondition,
    order: [["created_at", "DESC"]],
  });

  return notifications;
};

// =========================
// Get Unread Count
// =========================

const getUnreadCount = async (userId = null) => {
  let whereCondition = {
    isRead: false,
  };

  /*
        Count unread:
        1. Global notifications
        2. User-specific notifications
    */

  if (userId !== null) {
    whereCondition = {
      isRead: false,

      [Op.or]: [
        {
          userId: null,
        },
        {
          userId: userId,
        },
      ],
    };
  }

  const count = await Notification.count({
    where: whereCondition,
  });

  return count;
};

// =========================
// Mark Notification As Read
// =========================

const markAsRead = async (notificationId) => {
  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  await notification.update({
    isRead: true,
  });

  return notification;
};

// =========================
// Mark All Notifications As Read
// =========================

const markAllAsRead = async (userId = null) => {
  let whereCondition = {
    isRead: false,
  };

  /*
        Mark as read:
        1. Global notifications
        2. User-specific notifications
    */

  if (userId !== null) {
    whereCondition = {
      isRead: false,

      [Op.or]: [
        {
          userId: null,
        },
        {
          userId: userId,
        },
      ],
    };
  }

  await Notification.update(
    {
      isRead: true,
    },
    {
      where: whereCondition,
    },
  );

  return true;
};

// =========================
// Delete Notification
// =========================

const deleteNotification = async (notificationId) => {
  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  await notification.destroy();

  return true;
};

// =========================
// Export Services
// =========================

module.exports = {
  createNotification,

  getNotifications,

  getUnreadNotifications,

  getUnreadCount,

  markAsRead,

  markAllAsRead,

  deleteNotification,
};

const {
    createNotification,
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../services/notification.service");


// =========================
// Create Notification
// =========================

const create = async (req, res) => {

    try {

        const notification = await createNotification(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// =========================
// Get All Notifications
// =========================

const getAll = async (req, res) => {

    try {

        const userId = req.user?.id || null;

        const notifications =
            await getNotifications(userId);

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =========================
// Get Unread Notifications
// =========================

const getUnread = async (req, res) => {

    try {

        const userId = req.user?.id || null;

        const notifications =
            await getUnreadNotifications(userId);

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =========================
// Get Unread Count
// =========================

const getCount = async (req, res) => {

    try {

        const userId = req.user?.id || null;

        const count =
            await getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: {
                count
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =========================
// Mark Notification As Read
// =========================

const markRead = async (req, res) => {

    try {

        const notificationId =
            Number(req.params.id);

        const notification =
            await markAsRead(notificationId);

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// =========================
// Mark All As Read
// =========================

const markAllRead = async (req, res) => {

    try {

        const userId = req.user?.id || null;

        await markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message:
                "All notifications marked as read"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// =========================
// Delete Notification
// =========================

const remove = async (req, res) => {

    try {

        const notificationId =
            Number(req.params.id);

        await deleteNotification(notificationId);

        res.status(200).json({
            success: true,
            message:
                "Notification deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {

    create,
    getAll,
    getUnread,
    getCount,
    markRead,
    markAllRead,
    remove

};
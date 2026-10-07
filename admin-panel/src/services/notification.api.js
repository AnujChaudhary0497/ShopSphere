import api from "./api";

// Create Notification
export const createNotification = async (data) => {
    const response = await api.post("/notifications", data);
    return response.data;
};

// Get All Notifications
export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

// Get Unread Notifications
export const getUnreadNotifications = async () => {
    const response = await api.get("/notifications/unread");
    return response.data;
};

// Get Unread Notification Count
export const getUnreadCount = async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
};

// Mark All Notifications As Read
export const markAllNotificationsRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};

// Mark One Notification As Read
export const markNotificationRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

// Delete Notification
export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};
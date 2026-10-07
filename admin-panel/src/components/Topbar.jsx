import {
  Menu,
  Bell,
  ChevronDown,
  UserCircle,
  User,
  LockKeyhole,
  LogOut,
  Check,
  CheckCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getUnreadNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notification.api";

function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

  // =========================
  // States
  // =========================

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);

  const notificationRef = useRef(null);

  // =========================
  // Get Logged In User
  // =========================

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  // =========================
  // Fetch Notifications
  // =========================

  const fetchNotifications = async () => {
    try {
      const response = await getUnreadNotifications();

      const notificationData = response.data || [];

      setNotifications(notificationData);

      setNotificationCount(notificationData.length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // =========================
  // Fetch Notifications
  // On Page Load
  // =========================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // Close Dropdown
  // On Outside Click
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Profile Dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      // Close Notification Dropdown
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // Notification Bell Click
  // =========================

  const handleNotificationClick = () => {
    setNotificationOpen((prev) => !prev);

    setProfileOpen(false);
  };

  // =========================
  // Mark Single Notification
  // As Read
  // =========================

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);

      // Remove notification from
      // unread list
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );

      // Decrease count
      setNotificationCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // =========================
  // Mark All Notifications
  // As Read
  // =========================

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications([]);

      setNotificationCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // =========================
  // Profile Click
  // =========================

  const handleProfileClick = () => {
    setProfileOpen((prev) => !prev);

    setNotificationOpen(false);
  };

  // =========================
  // Navigate To Profile
  // =========================

  const handleProfile = () => {
    setProfileOpen(false);

    navigate("/profile");
  };

  // =========================
  // Navigate To Change Password
  // =========================

  const handleChangePassword = () => {
    setProfileOpen(false);

    navigate("/change-password");
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setProfileOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // =========================
  // Format Notification Date
  // =========================

  const formatNotificationDate = (date) => {
    if (!date) {
      return "";
    }

    const notificationDate = new Date(date);

    return notificationDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="topbar">
      {/* =========================
                Mobile Hamburger
            ========================= */}

      <button
        type="button"
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* =========================
                Page Title
            ========================= */}

      <div className="topbar-title">
        <h2>Dashboard</h2>
      </div>

      {/* =========================
                Right Side
            ========================= */}

      <div className="topbar-right">
        {/* =========================
                    Notification
                ========================= */}

        <div className="notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="notification-button"
            aria-label="Notifications"
            aria-expanded={notificationOpen}
            onClick={handleNotificationClick}
          >
            <Bell size={21} />

            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {/* =========================
                        Notification Dropdown
                    ========================= */}

          {notificationOpen && (
            <div className="notification-dropdown">
              {/* Header */}

              <div className="notification-dropdown-header">
                <div>
                  <h3>Notifications</h3>

                  <span>
                    {notificationCount > 0
                      ? `${notificationCount} unread`
                      : "No unread notifications"}
                  </span>
                </div>

                {notificationCount > 0 && (
                  <button
                    type="button"
                    className="mark-all-button"
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCheck size={15} />
                    Mark all
                  </button>
                )}
              </div>

              {/* Notification List */}

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <Bell size={30} />

                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div className="notification-item" key={notification.id}>
                      <div className="notification-item-icon">
                        <Bell size={17} />
                      </div>

                      <div className="notification-item-content">
                        <h4>{notification.title}</h4>

                        <p>{notification.message}</p>

                        <span className="notification-time">
                          {formatNotificationDate(notification.created_at)}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="notification-read-button"
                        title="Mark as read"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================
                    Admin Profile
                ========================= */}

        <div className="admin-profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="admin-profile"
            onClick={handleProfileClick}
            aria-expanded={profileOpen}
          >
            <div className="admin-avatar">
              <UserCircle size={34} />
            </div>

            <div className="admin-info">
              <span className="admin-name">{user?.name || "Admin"}</span>

              <span className="admin-role">
                {user?.role === "admin" ? "Administrator" : "User"}
              </span>
            </div>

            <ChevronDown
              size={18}
              className={profileOpen ? "profile-chevron-open" : ""}
            />
          </button>

          {/* =========================
                        Profile Dropdown
                    ========================= */}

          {profileOpen && (
            <div className="profile-dropdown">
              {/* Profile */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleProfile}
              >
                <User size={18} />

                <span>Profile</span>
              </button>

              {/* Change Password */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleChangePassword}
              >
                <LockKeyhole size={18} />

                <span>Change Password</span>
              </button>

              {/* Divider */}

              <div className="profile-dropdown-divider"></div>

              {/* Logout */}

              <button
                type="button"
                className="profile-dropdown-item logout-dropdown-item"
                onClick={handleLogout}
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;

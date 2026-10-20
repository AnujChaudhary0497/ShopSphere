import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  UserCircle,
  LockKeyhole,
  LogOut,
  X,
  ShieldCheck,
  KeyRound,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { hasPermission } from "../utils/permissions";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [rolePermissionOpen, setRolePermissionOpen] = useState(
    location.pathname.startsWith("/roles") ||
      location.pathname.startsWith("/permissions"),
  );

  useEffect(() => {
    if (
      location.pathname.startsWith("/roles") ||
      location.pathname.startsWith("/permissions")
    ) {
      setRolePermissionOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });

    onClose?.();
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      resource: "dashboard",
      action: "read",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/users",
      resource: "users",
      action: "read",
      icon: Users,
    },
    {
      label: "Products",
      path: "/products",
      resource: "products",
      action: "read",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/orders",
      resource: "orders",
      action: "read",
      icon: ShoppingCart,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    hasPermission(item.resource, item.action),
  );

  const rolePermissionActive =
    location.pathname.startsWith("/roles") ||
    location.pathname.startsWith("/permissions");

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>

        <span>ShopSphere</span>

        <button
          type="button"
          className="sidebar-close-button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main Menu */}
        <div className="nav-section">
          <p className="nav-section-title">MAIN MENU</p>

          {visibleMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Account */}
        <div className="nav-section">
          <p className="nav-section-title">ACCOUNT</p>

          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <UserCircle size={20} />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/change-password"
            onClick={onClose}
            className={({ isActive }) =>
              `nav-item ${isActive && !rolePermissionActive ? "active" : ""}`
            }
          >
            <LockKeyhole size={20} />
            <span>Change Password</span>
          </NavLink>

          {/* Role & Permission Dropdown */}
          {hasPermission("roles", "read") && (
            <div className="role-permission-menu">
              <button
                type="button"
                className={`nav-item role-permission-toggle ${
                  rolePermissionActive ? "active" : ""
                }`}
                onClick={() => setRolePermissionOpen((previous) => !previous)}
                aria-expanded={rolePermissionOpen}
              >
                <ShieldCheck size={20} />

                <span>Role & Permission</span>

                {rolePermissionOpen ? (
                  <ChevronDown size={16} className="role-menu-arrow" />
                ) : (
                  <ChevronRight size={16} className="role-menu-arrow" />
                )}
              </button>

              {rolePermissionOpen && (
                <div className="role-permission-submenu">
                  <NavLink
                    to="/roles"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `nav-item submenu-item ${isActive ? "active" : ""}`
                    }
                  >
                    <ShieldCheck size={18} />
                    <span>Roles</span>
                  </NavLink>

                  {hasPermission("permissions", "read") && (
                    <NavLink
                      to="/permissions"
                      onClick={onClose}
                      className={({ isActive }) =>
                        `nav-item submenu-item ${isActive ? "active" : ""}`
                      }
                    >
                      <KeyRound size={18} />
                      <span>Permissions</span>
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

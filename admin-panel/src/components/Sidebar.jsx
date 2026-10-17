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
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/permissions";

function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

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
        {
            label: "Role Management",
            path: "/roles",
            resource: "roles",
            action: "read",
            icon: ShieldCheck,
        },
    ];

    const visibleMenuItems = menuItems.filter((item) =>
        hasPermission(item.resource, item.action)
    );

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
                        className={({ isActive }) =>
                            `nav-item ${isActive ? "active" : ""}`
                        }
                    >
                        <UserCircle size={20} />
                        <span>Profile</span>
                    </NavLink>

                    <NavLink
                        to="/change-password"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? "active" : ""}`
                        }
                    >
                        <LockKeyhole size={20} />
                        <span>Change Password</span>
                    </NavLink>
                </div>
            </nav>

            {/* Logout */}
            <div className="sidebar-bottom">
                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
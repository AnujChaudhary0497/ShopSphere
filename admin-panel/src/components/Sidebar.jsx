import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    UserCircle,
    LockKeyhole,
    LogOut,
    X
} from "lucide-react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

function Sidebar({ isOpen, onClose }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });

        onClose();
    };

    return (
        <aside
            className={`sidebar ${
                isOpen ? "sidebar-open" : ""
            }`}
        >

            <div className="sidebar-logo">

                <div className="logo-icon">
                    S
                </div>

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

            <nav className="sidebar-nav">

                <div className="nav-section">

                    <p className="nav-section-title">
                        MAIN MENU
                    </p>

                    <NavLink
                        to="/dashboard"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/users"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>

                    <NavLink
                        to="/products"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <Package size={20} />
                        <span>Products</span>
                    </NavLink>

                    <NavLink
                        to="/orders"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </NavLink>

                </div>

                <div className="nav-section">

                    <p className="nav-section-title">
                        ACCOUNT
                    </p>

                    <NavLink
                        to="/profile"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <UserCircle size={20} />
                        <span>Profile</span>
                    </NavLink>
                    
                    <NavLink
                        to="/change-password"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <LockKeyhole size={20} />
                        <span>Change Password</span>
                    </NavLink>

                </div>

            </nav>

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
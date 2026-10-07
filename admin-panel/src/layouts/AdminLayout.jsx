import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="admin-main">

                <Topbar
                    onMenuClick={() => {
                        setSidebarOpen(true);
                    }}
                />

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >
                <h1>Access Denied</h1>

                <p>
                    You do not have permission to access
                    the admin panel.
                </p>
            </div>
        );
    }

    return <Outlet />;
}

export default AdminRoute;
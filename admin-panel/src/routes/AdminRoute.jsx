import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return <Navigate to="/login" replace />;
    }

    if (!user.role && !user.roleId) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h1>Role Not Assigned</h1>
                <p>Your account does not have an assigned role.</p>
            </div>
        );
    }

    return <Outlet />;
}

export default AdminRoute;
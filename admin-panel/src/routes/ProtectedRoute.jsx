import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasPermission } from "../utils/permissions";

function ProtectedRoute({ resource, action = "read" }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const location = useLocation();

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (!user.role) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Role Not Assigned</h2>
        <p>Your account does not have an assigned role.</p>
      </div>
    );
  }

  if (resource && !hasPermission(resource, action)) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>403 - Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;

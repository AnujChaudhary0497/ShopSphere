import { Navigate } from "react-router-dom";

const DashboardRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default DashboardRoute;

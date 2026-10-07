import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
                            AUTH ROUTES
                    ========================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* =========================
                        PROTECTED ADMIN ROUTES
                    ========================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/users" element={<Users />} />

              <Route path="/products" element={<Products />} />

              <Route path="/orders" element={<Orders />} />

              <Route path="/profile" element={<Profile />} />

              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
          </Route>
        </Route>

        {/* =========================
                            DEFAULT ROUTE
                    ========================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* =========================
                            UNKNOWN ROUTE
                    ========================= */}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

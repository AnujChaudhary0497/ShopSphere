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
import RoleManagement from "./pages/RoleManagement";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                {/* Authentication Required */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        {/* Dashboard */}
                        <Route
                            element={
                                <ProtectedRoute
                                    resource="dashboard"
                                    action="read"
                                />
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />
                        </Route>

                        {/* Users */}
                        <Route
                            element={
                                <ProtectedRoute
                                    resource="users"
                                    action="read"
                                />
                            }
                        >
                            <Route
                                path="/users"
                                element={<Users />}
                            />
                        </Route>

                        {/* Products */}
                        <Route
                            element={
                                <ProtectedRoute
                                    resource="products"
                                    action="read"
                                />
                            }
                        >
                            <Route
                                path="/products"
                                element={<Products />}
                            />
                        </Route>

                        {/* Orders */}
                        <Route
                            element={
                                <ProtectedRoute
                                    resource="orders"
                                    action="read"
                                />
                            }
                        >
                            <Route
                                path="/orders"
                                element={<Orders />}
                            />
                        </Route>

                        {/* Role Management */}
                        <Route
                            element={
                                <ProtectedRoute
                                    resource="roles"
                                    action="read"
                                />
                            }
                        >
                            <Route
                                path="/roles"
                                element={<RoleManagement />}
                            />
                        </Route>

                        {/* Account Routes */}
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />
                    </Route>
                </Route>

                {/* Default Routes */}
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
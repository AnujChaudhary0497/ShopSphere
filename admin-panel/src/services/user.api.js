import api from "./api";

// Get All Users
export const getUsers = async () => {
    const response = await api.get("/auth/users");
    return response.data;
};

// Get User By ID
export const getUserById = async (id) => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
};

// Update User
export const updateUser = async (id, data) => {
    const response = await api.put(`/auth/users/${id}`, data);
    return response.data;
};

// Toggle User Status
export const toggleUserStatus = async (id) => {
    const response = await api.patch(`/auth/users/${id}/status`);
    return response.data;
};

// Delete User
export const deleteUser = async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
};
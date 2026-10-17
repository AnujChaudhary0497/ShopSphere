import api from "./api";

// Get all roles
export const getRoles = async () => {
    const response = await api.get("/roles");
    return response.data;
};

// Create role
export const createRole = async (data) => {
    const response = await api.post("/roles", data);
    return response.data;
};

// Assign permissions to a role
export const assignPermissions = async (roleId, permissionIds) => {
    const response = await api.put(
        `/roles/${roleId}/permissions`,
        { permissionIds }
    );

    return response.data;
};

// Assign role to a user
export const assignRoleToUser = async (userId, roleId) => {
    const response = await api.put("/roles/assign-user", {
        userId,
        roleId,
    });

    return response.data;
};
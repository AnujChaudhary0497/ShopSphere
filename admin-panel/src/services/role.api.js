import api from "./api";

// ==================== ROLES ====================

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

// Assign permissions to role
export const assignPermissions = async (roleId, permissionIds) => {
  const response = await api.put(`/roles/${roleId}/permissions`, {
    permissionIds,
  });

  return response.data;
};

// Assign role to user
export const assignRoleToUser = async (userId, roleId) => {
  const response = await api.put("/roles/assign-user", {
    userId,
    roleId,
  });

  return response.data;
};

// ==================== PERMISSIONS ====================

// Get all permissions
export const getPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};

// Create permission
export const createPermission = async (data) => {
  const response = await api.post("/permissions", data);
  return response.data;
};

// Update permission
export const updatePermission = async (id, data) => {
  const response = await api.put(`/permissions/${id}`, data);
  return response.data;
};

// Delete permission
export const deletePermission = async (id) => {
  const response = await api.delete(`/permissions/${id}`);
  return response.data;
};

// Update role
export const updateRole = async (id, data) =>
  (await api.put(`/roles/${id}`, data)).data;

// Delete role
export const deleteRole = async (id) => (await api.delete(`/roles/${id}`)).data;

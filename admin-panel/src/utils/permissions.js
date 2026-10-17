export const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
};

export const hasPermission = (resource, action) => {
    const user = getStoredUser();

    // Super admin bypass
    if (user.role === "super_admin") {
        return true;
    }

    // Permissions must come from the backend login response
    const permissions = Array.isArray(user.permissions)
        ? user.permissions
        : [];

    return permissions.some((permission) => {
        if (typeof permission === "string") {
            return permission === `${resource}.${action}`;
        }

        return (
            permission.resource === resource &&
            permission.action === action
        );
    });
};
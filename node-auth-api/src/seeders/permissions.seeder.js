const Permission = require("../models/permission.model");

const modulePermissions = {
    dashboard: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
    products: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete"],
    notifications: ["create", "read", "update", "delete"],
    roles: ["create", "read", "update", "delete"],
    permissions: ["create", "read", "update", "delete"],
};

const seedPermissions = async () => {
    try {
        for (const [resource, actions] of Object.entries(modulePermissions)) {
            for (const action of actions) {
                const name = `${resource}.${action}`;

                await Permission.findOrCreate({
                    where: { name },
                    defaults: {
                        name,
                        resource,
                        action,
                        description: `${action} ${resource}`,
                    },
                });
            }
        }

        console.log("All module permissions seeded successfully.");
    } catch (error) {
        console.error("Permission seeding failed:", error.message);
        throw error;
    }
};

module.exports = seedPermissions;
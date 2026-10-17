require("dotenv").config();

const { sequelize } = require("../src/config/database");

async function up() {
    const transaction = await sequelize.transaction();

    try {
        // 1. Create roles table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                description VARCHAR(255) NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `, { transaction });

        // 2. Create permissions table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS permissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                resource VARCHAR(50) NOT NULL,
                action ENUM('create', 'read', 'update', 'delete') NOT NULL,
                description VARCHAR(255) NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `, { transaction });

        // 3. Create role_permissions table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS role_permissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                roleId INT NOT NULL,
                permissionId INT NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_role_permission (roleId, permissionId),
                CONSTRAINT fk_rp_role
                    FOREIGN KEY (roleId) REFERENCES roles(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_rp_permission
                    FOREIGN KEY (permissionId) REFERENCES permissions(id)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB
        `, { transaction });

        // 4. Insert roles without deleting existing records
        const roles = [
            ["super_admin", "Full system access"],
            ["admin", "Administrative access"],
            ["manager", "Management access"],
            ["editor", "Content editing access"],
            ["support", "Customer support access"],
            ["user", "Standard user access"]
        ];

        for (const [name, description] of roles) {
            await sequelize.query(`
                INSERT INTO roles (name, description)
                VALUES (:name, :description)
                ON DUPLICATE KEY UPDATE id = id
            `, {
                replacements: { name, description },
                transaction
            });
        }

        // 5. Check whether roleId already exists
        const [columns] = await sequelize.query(
            "SHOW COLUMNS FROM users LIKE 'roleId'",
            { transaction }
        );

        if (columns.length === 0) {
            await sequelize.query(`
                ALTER TABLE users ADD COLUMN roleId INT NULL
            `, { transaction });
        }

        // 6. Map existing roles to roleId
        await sequelize.query(`
            UPDATE users AS u
            INNER JOIN roles AS r ON r.name = u.role
            SET u.roleId = r.id
            WHERE u.roleId IS NULL
        `, { transaction });

        await transaction.commit();

        console.log("RBAC migration completed successfully.");

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

if (require.main === module) {
    up()
        .then(async () => {
            await sequelize.close();
            process.exit(0);
        })
        .catch(async (error) => {
            console.error("Migration failed:", error.message);
            await sequelize.close();
            process.exit(1);
        });
}

module.exports = { up };
import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  assignPermissions,
} from "../services/role.api";
import { hasPermission } from "../utils/permissions";

function formatName(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRoleId, setDeletingRoleId] = useState(null);

  // Role permissions checkbox editor
  const [permissionsRole, setPermissionsRole] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsSaving, setPermissionsSaving] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [success]);

  const canCreateRole = hasPermission("roles", "create");
  const canUpdateRole = hasPermission("roles", "update");
  const canDeleteRole = hasPermission("roles", "delete");
  const protectedRoles = [
    "super_admin",
    "admin",
    "manager",
    "editor",
    "support",
    "user",
    "inventory_manager",
  ];

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getRoles();

      const roleList = Array.isArray(response)
        ? response
        : (response?.roles ?? response?.data?.roles ?? response?.data ?? []);

      setRoles(Array.isArray(roleList) ? roleList : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load roles. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const resetForm = () => {
    setRoleName("");
    setDescription("");
    setEditingRole(null);
    setShowForm(false);
    setError("");
  };

  const handleStartEdit = (role) => {
    setError("");
    setSuccess("");
    setEditingRole(role);
    setRoleName(role.name || "");
    setDescription(role.description || "");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmitRole = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedName = roleName.trim().toLowerCase();
    if (!normalizedName) {
      setError("Please enter a role name.");
      return;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(normalizedName)) {
      setError(
        "Use lowercase letters, numbers and underscores. The name must start with a letter.",
      );
      return;
    }

    const duplicate = roles.some(
      (role) =>
        String(role.name).toLowerCase() === normalizedName &&
        role.id !== editingRole?.id,
    );
    if (duplicate) {
      setError("This role already exists.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: normalizedName,
        description: description.trim(),
      };

      if (editingRole) {
        await updateRole(editingRole.id, payload);
        setSuccess("Role updated successfully.");
      } else {
        await createRole(payload);
        setSuccess("Role created successfully.");
      }

      setRoleName("");
      setDescription("");
      setEditingRole(null);
      setShowForm(false);
      await loadRoles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${editingRole ? "update" : "create"} role. Please try again.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleManagePermissions = async (role) => {
    setError("");
    setSuccess("");
    setPermissionsRole(role);
    setPermissionsLoading(true);

    // Scroll the permissions editor into view so the click is immediately visible.
    window.setTimeout(() => {
      const editor = document.getElementById("role-permission-editor");
      if (editor) {
        editor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    try {
      const response = await getPermissions();

      // Support both Axios responses and APIs that return response.data directly.
      // The permissions controller returns { success, count, data: [...] }.
      const permissionList = Array.isArray(response)
        ? response
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data?.permissions)
            ? response.data.permissions
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.permissions)
                ? response.permissions
                : Array.isArray(response?.data?.data?.permissions)
                  ? response.data.data.permissions
                  : [];

      const normalizedList = permissionList.map((item) => ({
        ...item,
        id: item.id !== undefined && item.id !== null ? Number(item.id) : item.id,
        resource: item.resource || String(item.name || "").split(".")[0],
        action:
          item.action ||
          String(item.name || "").split(".").slice(1).join("."),
      }));
      setAllPermissions(normalizedList);

      const assigned = Array.isArray(role.permissions) ? role.permissions : [];
      const assignedIds = assigned
        .map((permission) => {
          if (typeof permission === "number") return permission;
          if (typeof permission === "string") {
            const found = normalizedList.find(
              (item) => item.name === permission,
            );
            return found?.id;
          }
          return permission?.id;
        })
        .filter((id) => id !== undefined && id !== null);

      setSelectedPermissionIds(assignedIds.map((id) => String(id)));
    } catch (err) {
      setPermissionsRole(null);
      setError(
        err.response?.data?.message ||
          "Unable to load permissions. Please try again.",
      );
    } finally {
      setPermissionsLoading(false);
    }
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissionIds((current) =>
      current.some((id) => String(id) === String(permissionId))
        ? current.filter((id) => String(id) !== String(permissionId))
        : [...current, String(permissionId)],
    );
  };

  // Fixed list of application modules required by the role-permission UI.
  // Only permissions that exist in the database can be assigned.
  const moduleResources = [
    "dashboard",
    "users",
    "products",
    "orders",
    "notifications",
    "roles",
    "permissions",
  ];
  const permissionActions = ["create", "read", "update", "delete"];

  const permissionGroups = moduleResources.map((resource) => ({
    resource,
    permissions: permissionActions.map((action) => {
      const permission = allPermissions.find((item) => {
        const permissionName = String(item.name || "").trim().toLowerCase();
        const itemResource = String(
          item.resource || permissionName.split(".")[0] || "",
        ).trim().toLowerCase();
        const itemAction = String(
          item.action ||
            permissionName.split(".").slice(1).join(".") ||
            "",
        ).trim().toLowerCase();
        return itemResource === resource && itemAction === action;
      });
      return { action, permission: permission || null };
    }),
  }));

  const togglePermissionGroup = (groupPermissions, shouldSelect) => {
    const ids = groupPermissions
      .map((permission) => permission.id)
      .filter((id) => id !== undefined && id !== null);
    setSelectedPermissionIds((current) => {
      const normalizedIds = ids.map(String);
      if (shouldSelect) return [...new Set([...current, ...normalizedIds])];
      return current.filter((id) => !normalizedIds.includes(String(id)));
    });
  };

  const toggleAllPermissions = (shouldSelect) => {
    setSelectedPermissionIds(
      shouldSelect
        ? allPermissions
            .map((permission) => permission.id)
            .filter((id) => id !== undefined && id !== null)
            .map(String)
        : [],
    );
  };

  const handleSavePermissions = async () => {
    if (!permissionsRole) return;

    setError("");
    setSuccess("");
    setPermissionsSaving(true);

    try {
      await assignPermissions(
        permissionsRole.id,
        selectedPermissionIds.map((id) => /^\d+$/.test(String(id)) ? Number(id) : id),
      );
      setSuccess(
        `Permissions updated for ${formatName(permissionsRole.name)}.`,
      );
      setPermissionsRole(null);
      setSelectedPermissionIds([]);
      await loadRoles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save permissions. Please try again.",
      );
    } finally {
      setPermissionsSaving(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the role "${formatName(role.name)}"?`,
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingRoleId(role.id);
    try {
      await deleteRole(role.id);
      setSuccess("Role deleted successfully.");
      if (editingRole?.id === role.id) resetForm();
      await loadRoles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete role. Check whether users are assigned to this role.",
      );
    } finally {
      setDeletingRoleId(null);
    }
  };

  return (
    <div className="role-management-page">
      <style>{`
                .role-management-page {
                    padding: 28px;
                    color: #1f2937;
                }

                .role-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 24px;
                }

                .role-page-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .role-page-title h1 {
                    margin: 0 0 6px;
                    font-size: 26px;
                }

                .role-page-title p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .role-header-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eef2ff;
                    color: #4f46e5;
                    border-radius: 12px;
                }

                .role-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 16px;
                    border: 0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                }

                .role-button-primary {
                    background: #4f46e5;
                    color: #fff;
                }

                .role-button-primary:hover {
                    background: #4338ca;
                }

                .role-button-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }

                .role-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.65;
                }

                .role-alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 13px 15px;
                    margin-bottom: 18px;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .role-alert-error {
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }

                .role-alert-success {
                    background: #f0fdf4;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }

                .role-form-card,
                .role-card {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                }

                .role-form-card {
                    padding: 22px;
                    margin-bottom: 24px;
                }

                .role-form-card h2 {
                    margin: 0 0 20px;
                    font-size: 19px;
                }

                .role-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 18px;
                }

                .role-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .role-form-group label {
                    font-size: 14px;
                    font-weight: 600;
                }

                .role-form-group input,
                .role-form-group textarea {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 11px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    outline: none;
                    font: inherit;
                }

                .role-form-group input:focus,
                .role-form-group textarea:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }

                .role-form-group textarea {
                    min-height: 90px;
                    resize: vertical;
                }

                .role-form-hint {
                    color: #6b7280;
                    font-size: 12px;
                }

                .role-form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .role-list-heading {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .role-list-heading h2 {
                    margin: 0;
                    font-size: 20px;
                }

                .role-count {
                    padding: 5px 10px;
                    background: #eef2ff;
                    color: #4338ca;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .role-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 18px;
                }

                .role-card {
                    padding: 20px;
                    min-width: 0;
                }

                .role-card-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .role-card-name {
                    margin: 0;
                    font-size: 18px;
                    overflow-wrap: anywhere;
                }

                .role-badge {
                    display: inline-block;
                    padding: 5px 9px;
                    border-radius: 6px;
                    background: #f3f4f6;
                    color: #374151;
                    font-size: 11px;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .role-card-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin: 0 0 16px;
                }

                .role-action-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 7px 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 7px;
                    background: #fff;
                    color: #374151;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .role-action-button:hover { background: #f9fafb; }
                .role-action-button:disabled { opacity: .6; cursor: not-allowed; }
                .role-action-delete { color: #b91c1c; border-color: #fecaca; }
                .role-action-delete:hover { background: #fef2f2; }

                 .role-permission-editor {
                     background: #fff;
                     border: 1px solid #c7d2fe;
                     border-radius: 12px;
                     padding: 22px;
                     margin-bottom: 24px;
                     box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                 }
                 .role-permission-editor-header {
                     display: flex;
                     align-items: center;
                     justify-content: space-between;
                     gap: 12px;
                     flex-wrap: wrap;
                     margin-bottom: 16px;
                 }
                 .role-permission-editor-header h2 {
                     margin: 0;
                     font-size: 19px;
                 }
                 .role-permission-checkbox-grid {
                     display: grid;
                     grid-template-columns: repeat(3, minmax(0, 1fr));
                     gap: 10px;
                 }
                 .role-permission-checkbox {
                     display: flex;
                     align-items: center;
                     gap: 9px;
                     padding: 11px 12px;
                     border: 1px solid #e5e7eb;
                     border-radius: 8px;
                     background: #f9fafb;
                     font-size: 13px;
                     overflow-wrap: anywhere;
                     cursor: pointer;
                 }
                 .role-permission-checkbox input {
                     width: 16px;
                     height: 16px;
                     accent-color: #4f46e5;
                     flex-shrink: 0;
                     cursor: pointer;
                 }
                 .role-permission-editor-actions {
                     display: flex;
                     gap: 10px;
                     flex-wrap: wrap;
                     margin-top: 18px;
                 }
                 @media (max-width: 900px) {
                     .role-permission-checkbox-grid {
                         grid-template-columns: repeat(2, minmax(0, 1fr));
                     }
                 }

                 .role-description {
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 18px;
                    overflow-wrap: anywhere;
                }

                .role-permission-heading {
                    margin: 0 0 10px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #374151;
                }

                .role-permissions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 7px;
                }

                .role-permission-chip {
                    padding: 6px 9px;
                    border: 1px solid #e5e7eb;
                    background: #f9fafb;
                    color: #374151;
                    border-radius: 6px;
                    font-size: 12px;
                }

                .role-no-permissions {
                    color: #9ca3af;
                    font-size: 13px;
                }

                .role-loading,
                .role-empty {
                    padding: 45px 20px;
                    text-align: center;
                    color: #6b7280;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                }

                .role-loading svg,
                .role-spinner {
                    animation: role-spin 1s linear infinite;
                }

                @keyframes role-spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .role-management-page {
                        padding: 16px;
                    }

                    .role-grid,
                    .role-form-grid {
                        grid-template-columns: 1fr;
                    }

                    .role-page-title h1 {
                        font-size: 22px;
                    }
                }

                .role-management-page { padding: 24px; color: #111827; }
                .role-page-header { margin-bottom: 22px; }
                .role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
                .role-card { padding: 18px; border-radius: 10px; box-shadow: none; }
                .role-card-name { font-size: 16px; }
                .role-card-actions { margin-bottom: 12px; }
                .role-action-button { min-height: 34px; }
                .role-description { min-height: 40px; margin-bottom: 14px; font-size: 13px; }
                .role-permission-summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid #eef2f7; }
                .role-permission-summary .role-permission-heading { margin: 0; }
                .role-permission-summary strong { color: #1d4ed8; font-size: 13px; }
                .role-permission-summary-hint { margin: 8px 0 0; color: #6b7280; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
                .permission-controls { margin-bottom: 14px; padding: 12px 14px; border: 1px solid #dbeafe; background: #f8fbff; border-radius: 9px; }
                .permission-master-checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; color: #1f2937; font-size: 13px; }
                .permission-master-checkbox input { width: 16px; height: 16px; accent-color: #2563eb; flex-shrink: 0; }
                .permission-master-checkbox span { display: flex; flex-direction: column; gap: 3px; }
                .permission-master-checkbox small { color: #6b7280; font-size: 12px; font-weight: 400; }
                .permission-module-list { display: grid; gap: 12px; }
                .permission-module { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
                .permission-module-header { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 13px 15px; background: #f8fafc; border-bottom: 1px solid #e5e7eb; }
                .permission-module-header h3 { margin: 0 0 4px; font-size: 14px; font-weight: 700; text-transform: capitalize; }
                .permission-module-header span { color: #6b7280; font-size: 12px; }
                .module-master-checkbox { white-space: nowrap; }
                .role-permission-checkbox-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 12px; gap: 8px; }
                .role-permission-checkbox { background: #fff; padding: 10px 11px; border-radius: 7px; }
                .role-permission-checkbox:hover { border-color: #93c5fd; background: #f8fbff; }
                @media (max-width: 1100px) { .role-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .role-permission-checkbox-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
                @media (max-width: 768px) { .role-management-page { padding: 16px; } .role-grid { grid-template-columns: 1fr; } .role-permission-checkbox-grid { grid-template-columns: 1fr; } .permission-module-header { align-items: flex-start; } }
            `}</style>

      {/* Page Header */}
      <div className="role-page-header">
        <div className="role-page-title">
          <div className="role-header-icon">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1>Role Management</h1>
            <p>Manage roles and view their assigned permissions.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="role-button role-button-secondary"
            onClick={loadRoles}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {canCreateRole && (
            <button
              type="button"
              className="role-button role-button-primary"
              onClick={() => {
                setError("");
                setSuccess("");
                if (showForm) {
                  resetForm();
                } else {
                  setEditingRole(null);
                  setRoleName("");
                  setDescription("");
                  setShowForm(true);
                }
              }}
            >
              {showForm ? <X size={17} /> : <Plus size={17} />}

              {showForm ? "Cancel" : "Create Role"}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="role-alert role-alert-error">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="role-alert role-alert-success">
          <CheckCircle size={19} />
          <span>{success}</span>
        </div>
      )}

      {/* Create Role Form */}
      {showForm && (editingRole ? canUpdateRole : canCreateRole) && (
        <div className="role-form-card">
          <h2>{editingRole ? "Edit Role" : "Create New Role"}</h2>

          <form onSubmit={handleSubmitRole}>
            <div className="role-form-grid">
              <div className="role-form-group">
                <label htmlFor="roleName">Role Name *</label>

                <input
                  id="roleName"
                  type="text"
                  placeholder="e.g. inventory_manager"
                  value={roleName}
                  onChange={(event) => setRoleName(event.target.value)}
                  required
                  maxLength={50}
                />

                <span className="role-form-hint">
                  Use lowercase letters, numbers and underscores.
                </span>
              </div>

              <div className="role-form-group">
                <label htmlFor="roleDescription">Description</label>

                <textarea
                  id="roleDescription"
                  placeholder="Describe this role..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={255}
                />
              </div>
            </div>

            <div className="role-form-actions">
              <button
                type="submit"
                className="role-button role-button-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={17} className="role-spinner" />
                    {editingRole ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingRole ? (
                      <CheckCircle size={17} />
                    ) : (
                      <Plus size={17} />
                    )}
                    {editingRole ? "Save Changes" : "Create Role"}
                  </>
                )}
              </button>

              <button
                type="button"
                className="role-button role-button-secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Role Permissions Checkbox Editor */}
      {permissionsRole && (
        <section
          id="role-permission-editor"
          className="role-permission-editor"
          style={{ scrollMarginTop: "24px" }}
        >
          <div className="role-permission-editor-header">
            <h2>Manage Permissions: {formatName(permissionsRole.name)}</h2>
            <span className="role-count">
              {selectedPermissionIds.length} selected
            </span>
          </div>

          {permissionsLoading ? (
            <div className="role-loading">
              <LoaderCircle size={24} />
              <p>Loading permissions...</p>
            </div>
          ) : (
            <>
              {allPermissions.length === 0 && (
                <div className="role-alert role-alert-error">
                  <AlertCircle size={19} />
                  <span>
                    No permission records were returned by the API. Modules are
                    listed below, but permissions must exist in the database
                    before they can be assigned.
                  </span>
                </div>
              )}
              <div className="permission-controls">
                <label className="permission-master-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      allPermissions.length > 0 &&
                      selectedPermissionIds.length === allPermissions.length
                    }
                    onChange={(event) =>
                      toggleAllPermissions(event.target.checked)
                    }
                    disabled={permissionsSaving}
                  />
                  <span>
                    <strong>Select all permissions</strong>
                    <small>
                      Select or clear every permission across all modules.
                    </small>
                  </span>
                </label>
              </div>
              <div className="permission-module-list">
                {permissionGroups.map(({ resource, permissions }) => {
                  const availablePermissions = permissions
                    .map((item) => item.permission)
                    .filter(Boolean);
                  const availableIds = availablePermissions
                    .map((permission) => permission.id)
                    .filter((id) => id !== undefined && id !== null);
                  const selectedCount = availableIds.filter((id) =>
                    selectedPermissionIds.includes(String(id)),
                  ).length;
                  const allAvailableSelected =
                    availableIds.length > 0 &&
                    selectedCount === availableIds.length;

                  return (
                    <section className="permission-module" key={resource}>
                      <div className="permission-module-header">
                        <div>
                          <h3>{formatName(resource)}</h3>
                          <span>
                            {selectedCount} of {availableIds.length} available
                            permissions selected
                          </span>
                        </div>
                        <label className="permission-master-checkbox module-master-checkbox">
                          <input
                            type="checkbox"
                            checked={allAvailableSelected}
                            onChange={(event) =>
                              togglePermissionGroup(
                                availablePermissions,
                                event.target.checked,
                              )
                            }
                            disabled={
                              permissionsSaving || availableIds.length === 0
                            }
                          />
                          <span>Select all</span>
                        </label>
                      </div>
                      <div className="role-permission-checkbox-grid">
                        {permissions.map(({ action, permission }) => (
                          <label
                            className="role-permission-checkbox"
                            key={`${resource}.${action}`}
                            title={
                              !permission
                                ? "This permission is missing from the database"
                                : `${resource}.${action}`
                            }
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(
                                permission &&
                                selectedPermissionIds.includes(String(permission.id)),
                              )}
                              onChange={() =>
                                permission && togglePermission(permission.id)
                              }
                              disabled={permissionsSaving || !permission}
                            />
                            <span>
                              {formatName(action)}
                              {!permission ? " (not configured)" : ""}
                            </span>
                          </label>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}

          <div className="role-permission-editor-actions">
            <button
              type="button"
              className="role-button role-button-primary"
              onClick={handleSavePermissions}
              disabled={permissionsLoading || permissionsSaving}
            >
              {permissionsSaving ? (
                <>
                  <LoaderCircle size={17} className="role-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={17} />
                  Save Permissions
                </>
              )}
            </button>

            <button
              type="button"
              className="role-button role-button-secondary"
              onClick={() => {
                setPermissionsRole(null);
                setSelectedPermissionIds([]);
                setAllPermissions([]);
                setError("");
              }}
              disabled={permissionsSaving}
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* Roles List */}
      <div className="role-list-heading">
        <h2>Available Roles</h2>

        <span className="role-count">{roles.length} Roles</span>
      </div>

      {loading ? (
        <div className="role-loading">
          <LoaderCircle size={28} style={{ marginBottom: "10px" }} />
          <p>Loading roles...</p>
        </div>
      ) : roles.length === 0 ? (
        <div className="role-empty">
          <ShieldCheck size={35} style={{ marginBottom: "10px" }} />
          <h3>No Roles Found</h3>
          <p>No roles are currently available.</p>
        </div>
      ) : (
        <div className="role-grid">
          {roles.map((role) => {
            const permissions = Array.isArray(role.permissions)
              ? role.permissions
              : [];

            return (
              <div className="role-card" key={role.id ?? role.name}>
                <div className="role-card-header">
                  <h3 className="role-card-name">{formatName(role.name)}</h3>

                  <span className="role-badge">ROLE #{role.id ?? "—"}</span>
                </div>

                <div className="role-card-actions">
                  {canUpdateRole && (
                    <button
                      type="button"
                      className="role-action-button"
                      onClick={() => handleManagePermissions(role)}
                      disabled={permissionsSaving}
                    >
                      <ShieldCheck size={14} /> Manage Permissions
                    </button>
                  )}
                  {!protectedRoles.includes(
                    String(role.name || "").toLowerCase(),
                  ) &&
                    (canUpdateRole || canDeleteRole) && (
                      <>
                        {canUpdateRole && (
                          <button
                            type="button"
                            className="role-action-button"
                            onClick={() => handleStartEdit(role)}
                            disabled={submitting || deletingRoleId === role.id}
                          >
                            <Pencil size={14} /> Edit
                          </button>
                        )}
                        {canDeleteRole && (
                          <button
                            type="button"
                            className="role-action-button role-action-delete"
                            onClick={() => handleDeleteRole(role)}
                            disabled={deletingRoleId === role.id}
                          >
                            {deletingRoleId === role.id ? (
                              <LoaderCircle
                                size={14}
                                className="role-spinner"
                              />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            {deletingRoleId === role.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </>
                    )}
                </div>

                <p className="role-description">
                  {role.description || "No description provided."}
                </p>

                <div className="role-permission-summary">
                  <span className="role-permission-heading">
                    Assigned permissions
                  </span>
                  <strong>{permissions.length}</strong>
                </div>
                <p className="role-permission-summary-hint">
                  {permissions.length > 0
                    ? `${permissions
                        .slice(0, 3)
                        .map((permission) =>
                          typeof permission === "string"
                            ? permission
                            : permission.name ||
                              [permission.resource, permission.action]
                                .filter(Boolean)
                                .join("."),
                        )
                        .join(
                          ", ",
                        )}${permissions.length > 3 ? ` +${permissions.length - 3} more` : ""}`
                    : "No permissions assigned yet."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoleManagement;

import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

import { getRoles, createRole } from "../services/role.api";
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

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canCreateRole = hasPermission("roles", "create");

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

  const handleCreateRole = async (event) => {
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
      (role) => String(role.name).toLowerCase() === normalizedName,
    );

    if (duplicate) {
      setError("This role already exists.");
      return;
    }

    setSubmitting(true);

    try {
      await createRole({
        name: normalizedName,
        description: description.trim(),
      });

      setSuccess("Role created successfully.");

      setRoleName("");
      setDescription("");
      setShowForm(false);

      await loadRoles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create role. Please check the backend API.",
      );
    } finally {
      setSubmitting(false);
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

                .role-loading svg {
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
                setShowForm((current) => !current);
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
      {showForm && canCreateRole && (
        <div className="role-form-card">
          <h2>Create New Role</h2>

          <form onSubmit={handleCreateRole}>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create Role
                  </>
                )}
              </button>

              <button
                type="button"
                className="role-button role-button-secondary"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
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

                <p className="role-description">
                  {role.description || "No description provided."}
                </p>

                <p className="role-permission-heading">
                  Assigned Permissions ({permissions.length})
                </p>

                {permissions.length > 0 ? (
                  <div className="role-permissions">
                    {permissions.map((permission, index) => {
                      const permissionName =
                        typeof permission === "string"
                          ? permission
                          : permission.name ||
                            [permission.resource, permission.action]
                              .filter(Boolean)
                              .join(".");

                      return (
                        <span
                          className="role-permission-chip"
                          key={permission.id ?? permissionName ?? index}
                        >
                          {permissionName}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="role-no-permissions">
                    No permissions assigned.
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoleManagement;

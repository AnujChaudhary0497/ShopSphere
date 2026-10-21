import { useCallback, useEffect, useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Search,
  AlertCircle,
} from "lucide-react";

import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../services/role.api";

import { hasPermission } from "../utils/permissions";

const emptyForm = {
  resource: "",
  action: "read",
  description: "",
};

function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [error, setError] = useState("");

  const canCreate = hasPermission("permissions", "create");
  const canUpdate = hasPermission("permissions", "update");
  const canDelete = hasPermission("permissions", "delete");

  const loadPermissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPermissions();

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.permissions)
          ? response.permissions
          : [];

      setPermissions(list);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load permissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const openCreateForm = () => {
    setEditingPermission(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (permission) => {
    setEditingPermission(permission);

    setForm({
      resource: permission.resource || "",
      action: permission.action || "read",
      description: permission.description || "",
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPermission(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const resource = form.resource.trim().toLowerCase();

    if (!/^[a-z][a-z0-9_]*$/.test(resource)) {
      setError(
        "Resource must start with a letter and contain only lowercase letters, numbers or underscores.",
      );
      return;
    }

    const payload = {
      resource,
      action: form.action,
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      if (editingPermission) {
        await updatePermission(editingPermission.id, payload);
      } else {
        await createPermission(payload);
      }

      closeForm();
      await loadPermissions();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save permission.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (permission) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${permission.name}"?`,
    );

    if (!confirmed) return;

    setError("");

    try {
      await deletePermission(permission.id);
      await loadPermissions();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete permission.");
    }
  };

  const moduleNames = [
    ...new Set(
      permissions.map((permission) => permission.resource).filter(Boolean),
    ),
  ].sort();

  const actionNames = [
    ...new Set(
      permissions.map((permission) => permission.action).filter(Boolean),
    ),
  ].sort();

  const filteredPermissions = permissions.filter((permission) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      permission.name?.toLowerCase().includes(query) ||
      permission.resource?.toLowerCase().includes(query) ||
      permission.action?.toLowerCase().includes(query) ||
      permission.description?.toLowerCase().includes(query);

    return (
      matchesSearch &&
      (moduleFilter === "all" || permission.resource === moduleFilter) &&
      (actionFilter === "all" || permission.action === actionFilter)
    );
  });

  return (
    <div className="permissions-page">
      <style>{`
                .permissions-page {
                    padding: 28px;
                    color: #1f2937;
                }

                .permissions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 24px;
                }

                .permissions-title {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .permissions-icon {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #4f46e5;
                    background: #eef2ff;
                    border-radius: 12px;
                }

                .permissions-title h1 {
                    margin: 0 0 5px;
                    font-size: 26px;
                }

                .permissions-title p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .permissions-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .permissions-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 11px 16px;
                    border: 0;
                    border-radius: 9px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .permissions-btn-primary {
                    background: #4f46e5;
                    color: #fff;
                }

                .permissions-btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }

                .permissions-btn-danger {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .permissions-btn:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                .permissions-alert {
                    margin-bottom: 18px;
                    padding: 13px 16px;
                    border-radius: 8px;
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                    font-size: 14px;
                }

                .permissions-form-card {
                    padding: 24px;
                    margin-bottom: 24px;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                }

                .permissions-form-card h2 {
                    margin: 0 0 22px;
                    font-size: 20px;
                }

                .permissions-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 18px;
                }

                .permissions-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .permissions-field label {
                    font-size: 14px;
                    font-weight: 600;
                }

                .permissions-field input,
                .permissions-field select,
                .permissions-field textarea {
                    box-sizing: border-box;
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    background: #fff;
                    color: #111827;
                    font: inherit;
                }

                .permissions-field textarea {
                    min-height: 95px;
                    resize: vertical;
                }

                .permissions-field small {
                    color: #6b7280;
                    font-size: 12px;
                }

                .permissions-form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 22px;
                }

                .permissions-summary-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .permissions-summary-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 18px 20px;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(15, 23, 42, .03);
                }
                .permissions-summary-icon {
                    display: grid;
                    place-items: center;
                    width: 44px;
                    height: 44px;
                    flex: 0 0 44px;
                    border-radius: 11px;
                    color: #4f46e5;
                    background: #eef2ff;
                }
                .permissions-summary-card strong {
                    display: block;
                    color: #111827;
                    font-size: 23px;
                    line-height: 1.2;
                }
                .permissions-summary-card span {
                    display: block;
                    margin-top: 4px;
                    color: #6b7280;
                    font-size: 12px;
                }
                .permissions-filter-select {
                    min-width: 145px;
                    padding: 10px 12px;
                    color: #374151;
                    background: #fff;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font: inherit;
                    font-size: 13px;
                    outline: none;
                }
                .permissions-filter-select:focus,
                .permissions-search:focus-within {
                    border-color: #818cf8;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, .10);
                }
                .permissions-toolbar-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .permissions-table tbody tr {
                    transition: background .15s ease;
                }
                .permissions-table td:first-child {
                    color: #6b7280;
                    font-variant-numeric: tabular-nums;
                }
                .permissions-table tbody tr:last-child td {
                    border-bottom: 0;
                }

                .permissions-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 14px;
                    flex-wrap: wrap;
                    margin-bottom: 18px;
                }

                .permissions-toolbar h2 {
                    margin: 0;
                    font-size: 21px;
                }

                .permissions-search {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    min-width: 250px;
                    padding: 10px 12px;
                    background: #fff;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                }

                .permissions-search input {
                    width: 100%;
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 14px;
                }

                .permissions-table-wrap {
                    overflow-x: auto;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                }

                .permissions-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .permissions-table th {
                    padding: 15px 18px;
                    background: #f9fafb;
                    color: #6b7280;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: .04em;
                    white-space: nowrap;
                }

                .permissions-table td {
                    padding: 16px 18px;
                    border-top: 1px solid #e5e7eb;
                    font-size: 14px;
                }

                .permissions-table tbody tr:hover {
                    background: #fafafa;
                }

                .permission-name {
                    font-weight: 600;
                    color: #111827;
                }

                .permission-badge {
                    display: inline-block;
                    padding: 5px 9px;
                    background: #eef2ff;
                    color: #4338ca;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .permission-action {
                    display: inline-block;
                    padding: 5px 9px;
                    background: #f3f4f6;
                    color: #374151;
                    border-radius: 6px;
                    font-size: 12px;
                    text-transform: capitalize;
                }

                .permission-row-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .permission-icon-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 34px;
                    height: 34px;
                    border: 1px solid #e5e7eb;
                    border-radius: 7px;
                    background: #fff;
                    color: #4b5563;
                    cursor: pointer;
                }

                .permission-icon-btn:hover {
                    background: #f3f4f6;
                }

                .permission-icon-btn.delete {
                    color: #dc2626;
                }

                .permissions-empty {
                    padding: 45px 20px;
                    text-align: center;
                    color: #6b7280;
                }

                @media (max-width: 768px) {
                    .permissions-page {
                        padding: 16px;
                    }

                    .permissions-form-grid {
                        grid-template-columns: 1fr;
                    }
                    .permissions-summary-grid {
                        grid-template-columns: 1fr;
                        gap: 10px;
                    }
                    .permissions-toolbar-controls {
                        width: 100%;
                    }
                    .permissions-filter-select {
                        flex: 1;
                        min-width: 0;
                    }

                    .permissions-title h1 {
                        font-size: 22px;
                    }

                    .permissions-search {
                        min-width: 0;
                        width: 100%;
                        box-sizing: border-box;
                    }
                }
            `}</style>

      {/* Header */}
      <div className="permissions-header">
        <div className="permissions-title">
          <div className="permissions-icon">
            <KeyRound size={27} />
          </div>

          <div>
            <h1>Permissions</h1>
            <p>Create and manage application permissions.</p>
          </div>
        </div>

        <div className="permissions-actions">
          <button
            type="button"
            className="permissions-btn permissions-btn-secondary"
            onClick={loadPermissions}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {canCreate && (
            <button
              type="button"
              className="permissions-btn permissions-btn-primary"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Create Permission
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="permissions-alert">
          <AlertCircle
            size={17}
            style={{
              verticalAlign: "middle",
              marginRight: 8,
            }}
          />
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="permissions-form-card">
          <h2>
            {editingPermission ? "Edit Permission" : "Create New Permission"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="permissions-form-grid">
              <div className="permissions-field">
                <label htmlFor="permissionResource">Resource *</label>

                <input
                  id="permissionResource"
                  type="text"
                  placeholder="e.g. products"
                  value={form.resource}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      resource: event.target.value,
                    }))
                  }
                  required
                  maxLength={50}
                />

                <small>Lowercase letters, numbers and underscores only.</small>
              </div>

              <div className="permissions-field">
                <label htmlFor="permissionAction">Action *</label>

                <select
                  id="permissionAction"
                  value={form.action}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      action: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="create">Create</option>
                  <option value="read">Read</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>

              <div className="permissions-field">
                <label htmlFor="permissionDescription">Description</label>

                <textarea
                  id="permissionDescription"
                  placeholder="Describe this permission..."
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  maxLength={255}
                />
              </div>

              <div className="permissions-field">
                <label>Permission Name</label>

                <input
                  type="text"
                  value={`${form.resource.trim().toLowerCase() || "resource"}.${form.action}`}
                  readOnly
                />

                <small>Generated automatically from resource and action.</small>
              </div>
            </div>

            <div className="permissions-form-actions">
              <button
                type="submit"
                className="permissions-btn permissions-btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingPermission
                    ? "Update Permission"
                    : "Create Permission"}
              </button>

              <button
                type="button"
                className="permissions-btn permissions-btn-secondary"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={17} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary cards */}
      <div className="permissions-summary-grid">
        <div className="permissions-summary-card">
          <div className="permissions-summary-icon">
            <KeyRound size={21} />
          </div>
          <div>
            <strong>{permissions.length}</strong>
            <span>Total permissions</span>
          </div>
        </div>
        <div className="permissions-summary-card">
          <div className="permissions-summary-icon">
            <ShieldCheck size={21} />
          </div>
          <div>
            <strong>{moduleNames.length}</strong>
            <span>Application modules</span>
          </div>
        </div>
        <div className="permissions-summary-card">
          <div className="permissions-summary-icon">
            <CheckCircle size={21} />
          </div>
          <div>
            <strong>{actionNames.length}</strong>
            <span>Permission actions</span>
          </div>
        </div>
      </div>

      {/* Table Toolbar and filters */}
      <div className="permissions-toolbar">
        <div>
          <h2>All Permissions</h2>
          <p style={{ margin: "5px 0 0", color: "#6b7280", fontSize: 13 }}>
            Showing {filteredPermissions.length} of {permissions.length}{" "}
            permissions
          </p>
        </div>

        <div className="permissions-toolbar-controls">
          <div className="permissions-search">
            <Search size={18} color="#6b7280" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search permissions"
            />
          </div>
          <select
            className="permissions-filter-select"
            value={moduleFilter}
            onChange={(event) => setModuleFilter(event.target.value)}
            aria-label="Filter by module"
          >
            <option value="all">All modules</option>
            {moduleNames.map((module) => (
              <option key={module} value={module}>
                {module.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <select
            className="permissions-filter-select"
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            aria-label="Filter by action"
          >
            <option value="all">All actions</option>
            {actionNames.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="permissions-table-wrap">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Permission</th>
              <th>Resource</th>
              <th>Action</th>
              <th>Description</th>
              {(canUpdate || canDelete) && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={canUpdate || canDelete ? 6 : 5}
                  className="permissions-empty"
                >
                  Loading permissions...
                </td>
              </tr>
            ) : filteredPermissions.length === 0 ? (
              <tr>
                <td
                  colSpan={canUpdate || canDelete ? 6 : 5}
                  className="permissions-empty"
                >
                  No permissions found.
                </td>
              </tr>
            ) : (
              filteredPermissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.id}</td>

                  <td>
                    <span className="permission-name">{permission.name}</span>
                  </td>

                  <td>
                    <span className="permission-badge">
                      {permission.resource}
                    </span>
                  </td>

                  <td>
                    <span className="permission-action">
                      {permission.action}
                    </span>
                  </td>

                  <td>{permission.description || "—"}</td>

                  {(canUpdate || canDelete) && (
                    <td>
                      <div className="permission-row-actions">
                        {canUpdate && (
                          <button
                            type="button"
                            className="permission-icon-btn"
                            title="Edit permission"
                            aria-label="Edit permission"
                            onClick={() => openEditForm(permission)}
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            className="permission-icon-btn delete"
                            title="Delete permission"
                            aria-label="Delete permission"
                            onClick={() => handleDelete(permission)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Permissions;

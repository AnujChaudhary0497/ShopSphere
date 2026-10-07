import { useEffect, useState } from "react";

import { Eye, Pencil, Power, Trash2, MoreVertical, X } from "lucide-react";

import {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "../services/user.api";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [viewUser, setViewUser] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
  });

  const [actionLoading, setActionLoading] = useState(false);

  // =========================
  // Fetch Users
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getUsers();

      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setError(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Action Menu
  // =========================

  const handleActionMenu = (userId) => {
    setOpenActionMenu((prev) => (prev === userId ? null : userId));
  };

  // =========================
  // View User
  // =========================

  const handleViewUser = async (userId) => {
    try {
      setActionLoading(true);

      const response = await getUserById(userId);

      setViewUser(response.data);

      setViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user:", error);

      alert(error.message || "Failed to load user details");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Open Edit Modal
  // =========================

  const handleEditUser = (user) => {
    setSelectedUser(user);

    setFormData({
      name: user.name || "",

      email: user.email || "",

      role: user.role || "user",

      isActive: user.isActive ?? true,
    });

    setEditModalOpen(true);
  };

  // =========================
  // Form Change
  // =========================

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // Update User
  // =========================

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      return;
    }

    try {
      setActionLoading(true);

      await updateUser(selectedUser.id, formData);

      setEditModalOpen(false);

      setSelectedUser(null);

      await fetchUsers();

      alert("User updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);

      alert(error.message || "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Toggle User Status
  // =========================

  const handleToggleStatus = async (user) => {
    const action = user.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await toggleUserStatus(user.id);

      await fetchUsers();
    } catch (error) {
      console.error("Failed to change user status:", error);

      alert(error.message || "Failed to change user status");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Delete User
  // =========================

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteUser(user.id);

      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);

      alert(error.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Close View Modal
  // =========================

  const closeViewModal = () => {
    setViewModalOpen(false);

    setViewUser(null);
  };

  // =========================
  // Close Edit Modal
  // =========================

  const closeEditModal = () => {
    setEditModalOpen(false);

    setSelectedUser(null);
  };

  return (
    <div className="dashboard-page">
      {/* =========================
          Header
      ========================= */}

      <div className="dashboard-header">
        <h1>Users</h1>

        <p>Manage registered users</p>
      </div>

      {/* =========================
          Users Card
      ========================= */}

      <div className="dashboard-card">
        <div className="card-header">
          <h3>All Users</h3>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Status</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">{user.role}</span>
                    </td>

                    <td>
                      <span
                        className={
                          user.isActive ? "status-active" : "status-inactive"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* =========================
                        Actions
                    ========================= */}

                    <td>
                      <div className="user-actions-dropdown">
                        {/* 3 Dots Button */}

                        <button
                          type="button"
                          className="user-action-menu-button"
                          title="Actions"
                          onClick={() => handleActionMenu(user.id)}
                          disabled={actionLoading}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown */}

                        {openActionMenu === user.id && (
                          <div className="user-action-dropdown-menu">
                            {/* View */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenu(null);

                                handleViewUser(user.id);
                              }}
                              disabled={actionLoading}
                            >
                              <Eye size={16} />

                              <span>View User</span>
                            </button>

                            {/* Edit */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenu(null);

                                handleEditUser(user);
                              }}
                              disabled={actionLoading}
                            >
                              <Pencil size={16} />

                              <span>Edit User</span>
                            </button>

                            {/* Activate / Deactivate */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenu(null);

                                handleToggleStatus(user);
                              }}
                              disabled={actionLoading}
                            >
                              <Power size={16} />

                              <span>
                                {user.isActive
                                  ? "Deactivate User"
                                  : "Activate User"}
                              </span>
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              className="delete-action"
                              onClick={() => {
                                setOpenActionMenu(null);

                                handleDeleteUser(user);
                              }}
                              disabled={actionLoading}
                            >
                              <Trash2 size={16} />

                              <span>Delete User</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          View User Modal
      ========================= */}

      {viewModalOpen && viewUser && (
        <div className="user-modal-overlay" onClick={closeViewModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>User Details</h3>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeViewModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="user-details">
              <div className="user-detail-row">
                <span>ID</span>

                <strong>{viewUser.id}</strong>
              </div>

              <div className="user-detail-row">
                <span>Name</span>

                <strong>{viewUser.name}</strong>
              </div>

              <div className="user-detail-row">
                <span>Email</span>

                <strong>{viewUser.email}</strong>
              </div>

              <div className="user-detail-row">
                <span>Role</span>

                <strong>{viewUser.role}</strong>
              </div>

              <div className="user-detail-row">
                <span>Status</span>

                <strong>{viewUser.isActive ? "Active" : "Inactive"}</strong>
              </div>

              {viewUser.created_at && (
                <div className="user-detail-row">
                  <span>Created</span>

                  <strong>
                    {new Date(viewUser.created_at).toLocaleString("en-IN")}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          Edit User Modal
      ========================= */}

      {editModalOpen && selectedUser && (
        <div className="user-modal-overlay" onClick={closeEditModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>Edit User</h3>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeEditModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="user-edit-form">
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="user">User</option>

                  <option value="admin">Admin</option>
                </select>
              </div>

              <label className="user-status-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                />

                <span>Active User</span>
              </label>

              <div className="user-modal-actions">
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={closeEditModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save-button"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

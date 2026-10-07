import { useEffect, useState } from "react";

import { updateProfile } from "../services/auth.api";

function Profile() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load logged-in user

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      });
    }
  }, []);

  // Handle input change

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit profile

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setEditing(true);
  };

  // Cancel editing

  const handleCancel = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setEditing(false);
  };

  // Update profile

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        name: formData.name,
        email: formData.email,
      });

      const updatedUser = {
        ...user,
        ...response.data,
      };

      // Update state

      setUser(updatedUser);

      // Update localStorage

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Show success message

      setSuccess(response.message || "Profile updated successfully");

      // Hide success message after 3 seconds

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);

      setError(error.message || "Failed to update profile");

      // Hide error message after 3 seconds

      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}

      <div className="dashboard-header">
        <h1>Profile</h1>

        <p>Manage your admin profile</p>
      </div>

      {/* Profile Card */}

      <div className="dashboard-card">
        {/* Card Header */}

        <div className="card-header">
          <h3>Admin Profile</h3>

          {!editing && (
            <button className="add-product-button" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        {/* Success Message */}

        {success && <div className="form-success">{success}</div>}

        {/* Error Message */}

        {error && <div className="form-error">{error}</div>}

        {/* Profile Content */}

        {user ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              {/* Full Name */}

              <div className="profile-form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>

              {/* Email */}

              <div className="profile-form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>

              {/* Role */}

              <div className="profile-form-group">
                <label>Role</label>

                <input
                  type="text"
                  value={user.role === "admin" ? "Administrator" : "User"}
                  disabled
                />
              </div>

              {/* Account Status */}

              <div className="profile-form-group">
                <label>Account Status</label>

                <input
                  type="text"
                  value={user.isActive === false ? "Inactive" : "Active"}
                  disabled
                />
              </div>
            </div>

            {/* Action Buttons */}

            {editing && (
              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        ) : (
          <div className="empty-state">
            <p>Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

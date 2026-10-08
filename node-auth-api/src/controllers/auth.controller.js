const {
  registerUser,
  getUsers,
  getUserById,
  loginUser,
  updateProfile,
  changePassword,
  updateUserByAdmin,
  toggleUserStatus,
  deleteUser,
  forgotPassword,
  validateResetToken,
  resetPassword,
} = require("../services/auth.service");

// =========================
// Register
// =========================

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,

      message: "User registered successfully",

      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Login
// =========================

const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({
      success: true,

      message: "Login successful",

      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Get All Users
// =========================

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();

    res.status(200).json({
      success: true,

      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Get User
// =========================

const getUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,

      message: "User fetched successfully",

      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Update Profile
// =========================

const updateUserProfile = async (req, res) => {
  try {
    const user = await updateProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,

      message: "Profile updated successfully",

      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Change Password
// =========================

const updatePassword = async (req, res) => {
  try {
    await changePassword(req.user.id, req.body);

    res.status(200).json({
      success: true,

      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Update User By Admin
// =========================

const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await updateUserByAdmin(userId, req.body);

    res.status(200).json({
      success: true,

      message: "User updated successfully",

      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Toggle Status
// =========================

const toggleStatus = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await toggleUserStatus(userId);

    res.status(200).json({
      success: true,

      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Delete User
// =========================

const removeUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    await deleteUser(userId);

    res.status(200).json({
      success: true,

      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Forgot Password
// =========================

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    await forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Validate Reset Token
// =========================

const validateResetPasswordToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,

        message: "Reset token is required",
      });
    }

    await validateResetToken(token);

    res.status(200).json({
      success: true,

      message: "Reset token is valid",
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Reset Password
// =========================

const resetPasswordRequest = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,

        message: "Reset token is required",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,

        message: "New password is required",
      });
    }

    await resetPassword(token, newPassword);

    res.status(200).json({
      success: true,

      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =========================
// Export
// =========================

module.exports = {
  register,

  login,

  getAllUsers,

  getUser,

  updateUserProfile,

  updatePassword,

  updateUser,

  toggleStatus,

  removeUser,

  forgotPasswordRequest,

  validateResetPasswordToken,

  resetPasswordRequest,
};

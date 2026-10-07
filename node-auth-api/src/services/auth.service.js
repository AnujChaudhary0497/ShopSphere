const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model");

const { sendPasswordResetEmail } = require("./email.service");

// =========================
// Register User
// =========================

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

// =========================
// Get All Users
// =========================

const getUsers = async () => {
  const users = await User.findAll({
    attributes: {
      exclude: ["password"],
    },

    order: [["created_at", "DESC"]],
  });

  return users;
};

// =========================
// Get User By ID
// =========================

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// =========================
// Login User
// =========================

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return {
    user,
    token,
  };
};

// =========================
// Update Profile
// =========================

const updateProfile = async (userId, { name, email }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }
  }

  await user.update({
    name: name ?? user.name,
    email: email ?? user.email,
  });

  return user;
};

// =========================
// Change Password
// =========================

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await user.update({
    password: hashedPassword,
  });

  return true;
};

// =========================
// Update User By Admin
// =========================

const updateUserByAdmin = async (userId, { name, email, role, isActive }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Check duplicate email

  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }
  }

  await user.update({
    name: name ?? user.name,
    email: email ?? user.email,
    role: role ?? user.role,

    isActive: isActive !== undefined ? isActive : user.isActive,
  });

  return user;
};

// =========================
// Toggle User Status
// =========================

const toggleUserStatus = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({
    isActive: !user.isActive,
  });

  return user;
};

// =========================
// Delete User
// =========================

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.destroy();

  return true;
};

// =========================
// Forgot Password
// =========================

const forgotPassword = async (email) => {
  const user = await User.findOne({
    where: { email },
  });

  // Security:
  // Do not reveal whether email exists.

  if (!user) {
    return true;
  }

  // Generate secure random reset token

  const resetToken = crypto.randomBytes(32).toString("hex");

  // Token expires after 15 minutes

  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  // Save token and expiry

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpires: resetTokenExpiry,
  });

  // Frontend reset password URL

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Send reset password email

  await sendPasswordResetEmail(user.email, resetLink);

  // Do not return token to frontend

  return true;
};

// =========================
// Validate Reset Password Token
// =========================

const validateResetToken = async (resetToken) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: resetToken,
    },
  });

  if (!user) {
    throw new Error("This reset link is invalid or has already been used.");
  }

  if (
    !user.resetPasswordExpires ||
    new Date() > new Date(user.resetPasswordExpires)
  ) {
    throw new Error("This reset link has expired.");
  }

  return true;
};

// =========================
// Reset Password
// =========================

const resetPassword = async (resetToken, newPassword) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: resetToken,
    },
  });

  // Invalid OR already-used token

  if (!user) {
    throw new Error("This reset link is invalid or has already been used.");
  }

  // Check token expiry

  if (
    !user.resetPasswordExpires ||
    new Date() > new Date(user.resetPasswordExpires)
  ) {
    throw new Error("This reset link has expired.");
  }

  // Hash new password

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // IMPORTANT:
  // Clear token after successful password reset.
  // This makes the reset link one-time use.

  await user.update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return true;
};

// =========================
// Export Services
// =========================

module.exports = {
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
};

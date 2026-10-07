import api from "./api";


// =========================
// Register
// =========================

export const registerUser = async (data) => {

    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};


// =========================
// Login
// =========================

export const loginUser = async (data) => {

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};


// =========================
// Forgot Password
// =========================

export const forgotPassword = async (email) => {

    const response = await api.post(
        "/auth/forgot-password",
        {
            email,
        }
    );

    return response.data;
};


// =========================
// Validate Reset Token
// =========================

export const validateResetToken = async (token) => {

    const response = await api.get(
        `/auth/validate-reset-token?token=${encodeURIComponent(token)}`
    );

    return response.data;
};


// =========================
// Reset Password
// =========================

export const resetPassword = async (data) => {

    const response = await api.post(
        "/auth/reset-password",
        data
    );

    return response.data;
};


// =========================
// Update Profile
// =========================

export const updateProfile = async (data) => {

    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;
};


// =========================
// Change Password
// =========================

export const changePassword = async (data) => {

    const response = await api.put(
        "/auth/change-password",
        data
    );

    return response.data;
};
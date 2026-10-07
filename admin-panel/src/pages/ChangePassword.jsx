import { useState } from "react";
import { changePassword } from "../services/auth.api";

function ChangePassword() {

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");


        // Check new password and confirm password
        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "New password and confirm password do not match"
            );

            setTimeout(() => {
                setError("");
            }, 3000);

            return;
        }


        // Check password length
        if (formData.newPassword.length < 8) {
            setError(
                "New password must be at least 8 characters"
            );

            setTimeout(() => {
                setError("");
            }, 3000);

            return;
        }


        // Prevent same password
        if (
            formData.currentPassword ===
            formData.newPassword
        ) {
            setError(
                "New password must be different from current password"
            );

            setTimeout(() => {
                setError("");
            }, 3000);

            return;
        }


        try {

            setLoading(true);

            const response = await changePassword({
                currentPassword:
                    formData.currentPassword,

                newPassword:
                    formData.newPassword
            });


            setSuccess(
                response.message ||
                "Password changed successfully"
            );


            // Clear form
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });


            // Hide success message
            setTimeout(() => {
                setSuccess("");
            }, 3000);


        } catch (error) {

            console.error(
                "Change password failed:",
                error
            );


            setError(
                error.message ||
                "Failed to change password"
            );


            // Hide error message
            setTimeout(() => {
                setError("");
            }, 3000);

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="dashboard-page">

            <div className="dashboard-header">

                <h1>
                    Change Password
                </h1>

                <p>
                    Update your account password
                </p>

            </div>


            <div className="dashboard-card">

                <div className="card-header">

                    <h3>
                        Password Settings
                    </h3>

                </div>


                {/* Success */}
                {success && (
                    <div className="form-success">
                        {success}
                    </div>
                )}


                {/* Error */}
                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}


                <form
                    className="profile-form"
                    onSubmit={handleSubmit}
                >

                    <div className="profile-form-grid">


                        {/* Current Password */}
                        <div className="profile-form-group">

                            <label>
                                Current Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="currentPassword"
                                    value={
                                        formData.currentPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword
                                        )
                                    }
                                >
                                    {showCurrentPassword
                                        ? "◉"
                                        : "◌"}
                                </button>

                            </div>

                        </div>


                        {/* New Password */}
                        <div className="profile-form-group">

                            <label>
                                New Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    value={
                                        formData.newPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowNewPassword(
                                            !showNewPassword
                                        )
                                    }
                                >
                                    {showNewPassword
                                        ? "◉"
                                        : "◌"}
                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}
                        <div className="profile-form-group">

                            <label>
                                Confirm New Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "◉"
                                        : "◌"}
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* Actions */}
                    <div className="profile-actions">

                        <button
                            type="submit"
                            className="profile-save-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing Password..."
                                : "Change Password"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ChangePassword;
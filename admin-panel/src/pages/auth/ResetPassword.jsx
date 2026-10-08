import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword, validateResetToken } from "../../services/auth.api";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // =========================
  // Validate Token On Page Load
  // =========================

  useEffect(() => {
    const checkResetToken = async () => {
      setTokenValid(false);

      // No token in URL
      if (!token) {
        toast.error("Invalid or missing password reset link.");
        setValidatingToken(false);
        return;
      }

      try {
        setValidatingToken(true);

        await validateResetToken(token);

        // Token is valid
        setTokenValid(true);
      } catch (error) {
        console.error("Reset token validation failed:", error);

        setTokenValid(false);

        toast.error(
          error.response?.data?.message ||
            "This reset link is invalid or has already been used.",
        );
      } finally {
        setValidatingToken(false);
      }
    };

    checkResetToken();
  }, [token]);

  // =========================
  // Reset Password
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Token check
    if (!token) {
      toast.error("Invalid or missing password reset link.");
      return;
    }

    // Token validity check
    if (!tokenValid) {
      toast.error("This reset link is invalid or has already been used.");
      return;
    }

    // Password required
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    // Password length
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    // Password match
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        token,
        newPassword,
      });

      toast.success(response.message || "Password reset successfully.");

      setNewPassword("");
      setConfirmPassword("");

      // Token has now been used
      setTokenValid(false);

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password failed:", error);

      toast.error(error.response?.data?.message || "Failed to reset password.");

      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Token Checking Screen
  // =========================

  if (validatingToken) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset Password</h1>

            <p>Checking your reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Main UI
  // =========================

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>

          <p>
            {tokenValid
              ? "Enter your new password below."
              : "Password reset link is no longer valid."}
          </p>
        </div>

        {/* Reset Form */}
        {tokenValid && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back To Login */}
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

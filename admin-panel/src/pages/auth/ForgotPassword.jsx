import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../../services/auth.api";


function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        try {

            setLoading(true);

            const response = await forgotPassword(
                email.trim()
            );

            setSuccess(
                response.message ||
                "If an account with this email exists, a password reset link has been sent."
            );

            setEmail("");

        } catch (error) {

            console.error(
                "Forgot password failed:",
                error
            );

            setError(
                error.message ||
                "Failed to send password reset email"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>
                        Forgot Password
                    </h1>

                    <p>
                        Enter your email address and
                        we'll send you a password reset link.
                    </p>

                </div>


                {success && (
                    <div className="form-success">
                        {success}
                    </div>
                )}


                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>

                </form>


                <div className="auth-footer">

                    <Link to="/login">
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );
}


export default ForgotPassword;
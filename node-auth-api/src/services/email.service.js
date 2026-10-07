const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendPasswordResetEmail = async (
    email,
    resetLink
) => {
    await transporter.sendMail({
        from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "ShopSphere - Reset Your Password",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
            ">

                <h2 style="color: #2563eb;">
                    ShopSphere
                </h2>

                <h3>
                    Password Reset Request
                </h3>

                <p>
                    We received a request to reset your
                    ShopSphere account password.
                </p>

                <p>
                    Click the button below to create a
                    new password:
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                    "
                >
                    Reset Password
                </a>

                <p style="
                    margin-top: 25px;
                    color: #6b7280;
                    font-size: 14px;
                ">
                    This link will expire in 15 minutes.
                </p>

                <p style="
                    color: #6b7280;
                    font-size: 14px;
                ">
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

            </div>
        `,
    });
};

module.exports = {
    sendPasswordResetEmail,
};
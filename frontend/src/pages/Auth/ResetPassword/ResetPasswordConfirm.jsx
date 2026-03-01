import Form from "../../../components/Form/Form.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../../api/authService.js";

export default function ResetPasswordConfirm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [_loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { uid, token } = useParams();

    useEffect(() => {
        if (!uid || !token) {
            setError("Invalid password reset link");
        }
    }, [uid, token]);

    const inputs = [
        {
            id: "reset-new-password",
            label: "New Password",
            type: "password",
            placeholder: "Enter your password",
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
        },
        {
            id: "reset-confirm-password",
            label: "Confirm New Password",
            type: "password",
            placeholder: "Repeat your password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!newPassword || newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPasswordConfirm(uid, token, newPassword, confirmPassword);
            navigate('/sign-in');
        } catch (err) {
            console.error('Password reset confirm error:', err);
            if (err.new_password) {
                setError(err.new_password[0]);
            } else if (err.token) {
                setError("Invalid or expired reset link");
            } else {
                setError(err.message || 'Failed to reset password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form method="post" className="form reset-confirm__form container" onSubmit={handleSubmit}>
            <div className="form__inner reset-confirm__form-inner">
                <Form
                    title="Reset Password"
                    inputs={inputs}
                    buttonText="Reset Password"
                    isLogin={false}
                />

                {error && (
                    <p className="form__message" style={{
                        margin: 0,
                        marginTop: '0.5rem',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#c0392b',
                        textAlign: 'center',
                    }}>
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}

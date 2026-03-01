import Form from "../../../components/Form/Form.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../api/authService.js";

export default function ResetPasswordEmail() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [_success, setSuccess] = useState("");
    const [_loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const inputs = [
        {
            id: "reset-email",
            label: "Email",
            type: "email",
            placeholder: "example@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(email);
            setSuccess("Password reset instructions have been sent to your email");
            setTimeout(() => {
                navigate('/password/reset/done');
            }, 2000);
        } catch (err) {
            console.error('Password reset error:', err);
            if (err.email) {
                setError(err.email[0]);
            } else {
                setError(err.message || 'Failed to send password reset email');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form method="post" className="form reset-email__form container" onSubmit={handleSubmit}>
            <div className="form__inner reset-email__form-inner">
                <Form
                    title="Reset Password"
                    inputs={inputs}
                    buttonText="Send"
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

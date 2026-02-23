import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "../../../components/Form/Form.jsx";
import authService from "../../../api/authService";
import { useAuth } from "../../../context/AuthContext.jsx";

const CODE_LENGTH = 6;

export default function SignUpCode() {
    const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { completeSignUp } = useAuth();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/sign-up", { replace: true });
        }
    }, [email, navigate]);

    if (!email) {
        return null;
    }

    const handleChange = (index) => (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(-1);
        const nextCode = [...code];
        nextCode[index] = value;
        setCode(nextCode);

        if (value && index < CODE_LENGTH - 1) {
            const nextInput = document.getElementById(`signup-code-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index) => (e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const prevInput = document.getElementById(`signup-code-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, CODE_LENGTH);
        if (!pasted) return;
        const next = [...code];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setCode(next);
        const focusIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
        setTimeout(() => {
            const el = document.getElementById(`signup-code-${focusIndex}`);
            if (el) el.focus();
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const codeStr = code.join("");
        if (codeStr.length !== CODE_LENGTH) {
            setError("Please enter the full 6-digit code.");
            return;
        }
        setLoading(true);
        try {
            const response = await authService.signUpVerify(email, codeStr);
            completeSignUp(response);
            navigate("/feed");
        } catch (err) {
            const msg = err.email?.[0] ?? err.code?.[0] ?? err.non_field_errors?.[0] ?? err.message ?? "Invalid or expired code. Try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form signup-code__form container" onSubmit={handleSubmit}>
            <div className="form__inner signup-code__form-inner">
                <Form
                    title="Enter code"
                    subtitle="We have sent you a confirmation code by email."
                    buttonText="Confirm"
                    isLogin={false}
                >
                    <div className="form__code">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`signup-code-${index}`}
                                className="form__code-input"
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={handleChange(index)}
                                onKeyDown={handleKeyDown(index)}
                                onPaste={handlePaste}
                                disabled={loading}
                            />
                        ))}
                    </div>
                </Form>
                {error && (
                    <p className="form__message" style={{
                        margin: 0,
                        marginTop: "0.5rem",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#c0392b",
                        textAlign: "center",
                    }}>
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}


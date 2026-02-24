import Form from "../../../components/Form/Form.jsx";
import googleIcon from "../../../assets/images/Auth/google.svg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ButtonLink from "../../../components/Button/Button.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);
    const callbackRef = useRef(null);
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();

    callbackRef.current = (response) => {
        if (!response?.credential) return;
        setError('');
        loginWithGoogle(response.credential)
            .then(() => navigate('/feed'))
            .catch((err) => {
                const msg = err?.detail ?? err?.message ?? 'Google sign in failed';
                setError(typeof msg === 'string' ? msg : 'Google sign in failed');
            });
    };

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;
        const check = () => {
            if (window.google?.accounts?.id) {
                setGoogleReady(true);
                return true;
            }
            return false;
        };
        if (check()) return;
        const t = setInterval(() => { if (check()) clearInterval(t); }, 100);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (!googleReady || !GOOGLE_CLIENT_ID) return;
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => callbackRef.current?.(response),
            locale: 'en',
        });
    }, [googleReady]);

    const handleGoogleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id) return;
        window.google.accounts.id.prompt();
    };

    const inputs = [
        {
            id: "form__field-email",
            label: "Email",
            type: "email",
            placeholder: "example@gmail.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },

        {
            id: "form__field-password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/feed');
        } catch (err) {
            console.error('Sign in error:', err);
            if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
                setError('Server is unreachable. Check your connection.');
            } else if (err.email) {
                setError(err.email[0]);
            } else if (err.password) {
                setError(err.password[0]);
            } else if (err.non_field_errors) {
                setError(err.non_field_errors[0]);
            } else {
                setError(err.message || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form login__form container" onSubmit={handleSubmit}>
            <div className="form__inner login__form-inner">
                <Form
                    title='Sign In'
                    inputs={inputs}
                    buttonText="Sign In"
                    isLogin={true}
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

                <footer className="form__footer">
                    <div className="form__or login__form-or">
                        Or
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleClick}
                        className="form__google login__form-google"
                        disabled={!GOOGLE_CLIENT_ID}
                    >
                        Continue with Google
                    </button>

                    <div className="form__notreg login__form-notreg">
                        <span className="form__notreg-text login__form-notreg-text">Not registered yet?</span> <ButtonLink to="/sign-up" className="form__notreg-link login__form-notreg-link">Create an account</ButtonLink>
                    </div>
                </footer>
            </div>
        </form>
    )
}
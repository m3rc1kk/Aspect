import Form from "../../../components/Form/Form.jsx";
import googleIcon from "../../../assets/images/Auth/google.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonLink from "../../../components/Button/Button.jsx";
import AvatarUpload from "../../../components/AvatarUpload/AvatarUpload.jsx";
import Input from "../../../components/Input/Input.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleUsernameChange = (e) => {
        let next = String(e.target.value ?? "");
        next = next.replace(/^@ ?/, "");
        next = next.replace(/@/g, "");
        setUsername(next.trimStart().slice(0, 30));
    };

    const inputs = [
        {
            id: "form__field-email",
            label: "Email",
            type: "email",
            placeholder: "example@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },

        {
            id: "form__field-username",
            label: "Username",
            type: "text",
            placeholder: "@ user",
            value: `@ ${username}`,
            maxLength: 32,
            onChange: handleUsernameChange,
        },

        {
            id: "form__field-nickname",
            label: "Nickname",
            type: "text",
            placeholder: "Ivan Ivanov",
            value: nickname,
            maxLength: 30,
            onChange: (e) => setNickname(e.target.value.slice(0, 30)),
        },

        {
            id: "form__field-password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
        },

        {
            id: "form__field-password-confirm",
            label: "Confirm Password",
            type: "password",
            placeholder: "Repeat your password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!email || !username || !nickname || !password) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const response = await register({
                email,
                username,
                nickname,
                password,
                confirmPassword,
                avatar
            });
            navigate('/sign-up/code', { state: { email: response.email } });
        } catch (err) {
            console.error('Sign up error:', err);
            if (err.email) {
                setError(err.email[0]);
            } else if (err.username) {
                setError(err.username[0]);
            } else if (err.password) {
                setError(err.password[0]);
            } else if (err.avatar) {
                setError(err.avatar[0]);
            } else if (err.nickname) {
                setError(err.nickname[0]);
            } else if (err.non_field_errors) {
                setError(err.non_field_errors[0]);
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form signup__form container" onSubmit={handleSubmit}>
            <div className="form__inner signup__form-inner">
                <Form
                    title='Sign Up'
                    inputs={inputs}
                    buttonText="Sign Up"
                    isLogin={false}
                >
                    <AvatarUpload onImageChange={setAvatar} />
                    {inputs.map(({ id, label, type, placeholder, value, onChange }) => (
                        <Input
                            key={id}
                            id={id}
                            label={label}
                            type={type}
                            placeholder={placeholder}
                            className="form__field auth__form-field"
                            value={value}
                            onChange={onChange}
                        />
                    ))}
                </Form>

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
                    <div className="form__or signup__form-or">
                        Or
                    </div>

                    <ButtonLink to={'/'} className="form__google signup__form-google">
                        <img src={googleIcon} alt="Google" width={16} height={16} loading='lazy' className="form__google-icon signup__form-google-icon" /> Google
                    </ButtonLink>

                    <div className="form__notreg signup__form-notreg">
                        <span className="form__notreg-text signup__form-notreg-text">Already have an account?</span> <ButtonLink to="/sign-in" className="form__notreg-link signup__form-notreg-link">Sign In</ButtonLink>
                    </div>
                </footer>
            </div>
        </form>
    )
}
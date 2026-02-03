import Form from "../../../components/Form/Form.jsx";
import googleIcon from "../../../assets/images/Auth/google.svg";
import { useState } from "react";
import ButtonLink from "../../../components/Button/Button.jsx";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleUsernameChange = (e) => {
        let next = String(e.target.value ?? "");
        next = next.replace(/^@ ?/, "");
        next = next.replace(/@/g, "");
        setUsername(next.trimStart());
    };

    const inputs = [
        {id: "form__field-email",
            label: "Email",
            type: "email",
            placeholder: "example@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },

        {id: "form__field-username",
            label: "Username",
            type: "text",
            placeholder: "@ user",
            value: `@ ${username}`,
            onChange: handleUsernameChange,
        },

        {id: "form__field-nickname",
            label: "Nickname",
            type: "text",
            placeholder: "Ivan Ivanov",
            value: nickname,
            onChange: (e) => setNickname(e.target.value),
        },

        {id: "form__field-password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
        },

        {id: "form__field-password-confirm",
            label: "Confirm Password",
            type: "password",
            placeholder: "Repeat your password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
        }
    ];


    return (
        <form method='post' className="form signup__form container" >
            <div className="form__inner signup__form-inner">
                <Form
                    title='Sign Up'
                    inputs={inputs}
                    buttonText='Sign Up'
                    isLogin={false}
                />

                <footer className="form__footer">
                    <div className="form__or signup__form-or">
                        Or
                    </div>

                    <ButtonLink to={'/'} className="form__google signup__form-google">
                        <img src={googleIcon} alt="Google" width={16} height={16} loading='lazy' className="form__google-icon signup__form-google-icon"/> Google
                    </ButtonLink>

                    <div className="form__notreg signup__form-notreg">
                        <span className="form__notreg-text signup__form-notreg-text">Already have an account?</span> <ButtonLink to="/sign-in" className="form__notreg-link signup__form-notreg-link">Sign In</ButtonLink>
                    </div>
                </footer>
            </div>
        </form>
    )
}
import Form from "../../../components/Form/Form.jsx";
import googleIcon from "../../../assets/images/Auth/google.svg";
import { useState } from "react";
import ButtonLink from "../../../components/Button/Button.jsx";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const inputs = [
        {id: "form__field-email",
            label: "Email",
            type: "email",
            placeholder: "example@gmail.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
        },

        {id: "form__field-password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
        }
    ];


    return (
        <form method='post' className="form login__form container" >
            <div className="form__inner login__form-inner">
                <Form
                    title='Sign In'
                    inputs={inputs}
                    buttonText='Sign In'
                    isLogin={true}
                />

                <footer className="form__footer">
                    <div className="form__or login__form-or">
                        Or
                    </div>

                    <ButtonLink to={'/'} className="form__google login__form-google">
                        <img src={googleIcon} alt="Google" width={16} height={16} loading='lazy' className="form__google-icon login__form-google-icon"/> Google
                    </ButtonLink>

                    <div className="form__notreg login__form-notreg">
                        <span className="form__notreg-text login__form-notreg-text">Not registered yet?</span> <ButtonLink to="/sign-up" className="form__notreg-link login__form-notreg-link">Create an account</ButtonLink>
                    </div>
                </footer>
            </div>
        </form>
    )
}
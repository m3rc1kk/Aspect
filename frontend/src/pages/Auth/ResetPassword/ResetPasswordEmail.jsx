import Form from "../../../components/Form/Form.jsx";
import { useState } from "react";

export default function ResetPasswordEmail() {
    const [email, setEmail] = useState("");

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

    return (
        <form method="post" className="form reset-email__form container">
            <div className="form__inner reset-email__form-inner">
                <Form
                    title="Reset Password"
                    inputs={inputs}
                    buttonText="Send"
                    isLogin={false}
                />
            </div>
        </form>
    );
}

import Form from "../../../components/Form/Form.jsx";
import { useState } from "react";

export default function ResetPasswordConfirm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    return (
        <form method="post" className="form reset-confirm__form container">
            <div className="form__inner reset-confirm__form-inner">
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

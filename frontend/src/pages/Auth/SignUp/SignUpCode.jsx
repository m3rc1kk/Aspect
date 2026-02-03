import { useState } from "react";
import Form from "../../../components/Form/Form.jsx";

const CODE_LENGTH = 6;

export default function SignUpCode() {
    const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));

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

    return (
        <form method="post" className="form signup-code__form container">
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
                            />
                        ))}
                    </div>
                </Form>
            </div>
        </form>
    );
}


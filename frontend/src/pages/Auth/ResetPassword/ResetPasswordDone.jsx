import Form from "../../../components/Form/Form.jsx";

export default function ResetPasswordDone() {
    return (
        <form className="form reset-done__form container">
            <div className="form__inner reset-done__form-inner">
                <Form
                    title="Reset password"
                    inputs={[]}
                    isLogin={false}
                    text="We sent you a link by email"
                    withButton={false}
                />
            </div>
        </form>
    );
}

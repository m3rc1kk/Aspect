import ButtonLink from "../Button/Button.jsx";
import Input from "../Input/Input.jsx";
import Logo from "../Logo/Logo.jsx";

export default function Form({
    title,
    inputs = [],
    buttonText,
    isLogin = false,
    text = '',
    withButton = true,
    subtitle = '',
    children,
}) {

    return (
        <>
            <header className="form__header">
                <Logo
                    className="form__logo"
                />
                <h1 className="form__title">{title}</h1>
                {subtitle && (
                    <p className="form__subtitle">{subtitle}</p>
                )}
            </header>

            <div className="form__inputs">
                {children
                    ? children
                    : inputs.length > 0
                        ? inputs.map(({ id, label, type, placeholder, value, onChange }) => (
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
                        ))
                        : (
                            <p className='form__text'>{text}</p>
                        )
                }
            </div>

            {isLogin && (
                <ButtonLink to="/password/reset" className="form__forgot login__form-forgot">
                    Forgot Password?
                </ButtonLink>
            )}

            {withButton && (
                <ButtonLink
                    type='submit'
                    className={`form__button button__form login__form-button${!isLogin ? ' form__button--margin' : ''}`}
                >
                    {buttonText}
                </ButtonLink>
            )}
        </>
    )
}
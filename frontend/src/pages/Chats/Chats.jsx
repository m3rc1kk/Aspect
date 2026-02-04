import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import avatar from '../../assets/images/Profile/avatar.png'
import fileIcon from '../../assets/images/Chats/files.svg'
import sendIcon from '../../assets/images/Chats/send.svg'
import settingsIcon from '../../assets/images/Chats/settings.svg'


export default function Chats() {


    return (
        <>
            <Header />
            <div className="chats block container">
                <div className="chats__inner block__inner">
                    <div className="chats__menu">
                        <h1 className="chats__title">Chats</h1>

                        <ul className="chats__list">
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar"/>
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                        </ul>
                    </div>

                    <div className="chats__main">
                        <header className="chats__main-header">
                            <div className="chats__main-user">
                                <img src={avatar} height={42} width={42} loading='lazy' alt="" className="chats__main-avatar"/>
                                <div className="chats__main-user-info">
                                    <h1 className="chats__main-user-nickname">Donald Trump</h1>
                                    <span className="chats__main-user-lastseen">last seen 12 hours ago</span>
                                </div>
                            </div>

                            <ButtonLink to="/" className={'chats__main-settings'}>
                                <img src={settingsIcon} width={40} height={40} loading='lazy' alt="" className="chats__main-settings-icon"/>
                            </ButtonLink>
                        </header>

                        <div className="chats__correspondence">
                            <div className="chats__message chats__message--my">
                                <span className="chats__message-text chats__message-text--my">Hello bro u so good u know?</span>
                                <span className="chats__message-time chats__message-time--my">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello bro u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>
                        </div>

                        <div className="chats__send">
                            <input type="text" className="chats__send-input"/>
                            <div className="chats__buttons">
                                <div className="chats__actions">
                                    <ButtonLink
                                        type="button"
                                        className="chats__attach"
                                        onClick={() => {}}
                                        aria-label="Attach media"
                                    >
                                        <img src={fileIcon} alt="" width={40} height={40} loading="lazy" />
                                    </ButtonLink>
                                    <ButtonLink
                                        type="submit"
                                        className="chats__send"
                                        aria-label="Send message"
                                    >
                                        <img src={sendIcon} alt="" width={40} height={40} loading="lazy" />
                                    </ButtonLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

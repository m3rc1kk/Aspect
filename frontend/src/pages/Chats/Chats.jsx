import { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import avatar from '../../assets/images/Profile/avatar.png'
import fileIcon from '../../assets/images/Chats/files.svg'
import sendIcon from '../../assets/images/Chats/send.svg'
import settingsIcon from '../../assets/images/Chats/settings.svg'
import backIcon from "../../assets/images/Notifications/back.svg";


export default function Chats() {

    const [activeChatId, setActiveChatId] = useState(null);

    return (
        <>
            {!activeChatId && <Header />}
            <div className={`chats block container ${activeChatId ? 'chats--detail' : ''}`}>
                <div className="chats__inner block__inner">
                    <div className="chats__menu">
                        <h1 className="chats__title">Chats</h1>

                        <ul className="chats__list">
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(1)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(2)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(3)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(4)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>

                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(5)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(6)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(7)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(8)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(9)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink
                                    type="button"
                                    className={'chats__link'}
                                    onClick={() => setActiveChatId(10)}
                                >
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
                                    <div className="chats__menu-info">
                                        <h1 className="chats__menu-nickname">Donald Trump</h1>
                                        <span className="chats__menu-message">Hey bro, how are you doing?</span>
                                    </div>
                                </ButtonLink>
                            </li>
                            <li className="chats__item">
                                <ButtonLink to="/" className={'chats__link'}>
                                    <img src={avatar} width={42} height={42} loading='lazy' alt="" className="chats__menu-avatar" />
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
                            <button
                                type="button"
                                className="chats__back"
                                onClick={() => setActiveChatId(null)}
                                aria-label="Back to chats list"
                            >
                                <img src={backIcon} alt="" width={36} height={36} />
                            </button>
                            <div className="chats__main-user">
                                <img src={avatar} height={42} width={42} loading='lazy' alt="" className="chats__main-avatar" />
                                <div className="chats__main-user-info">
                                    <h1 className="chats__main-user-nickname">Donald Trump</h1>
                                    <span className="chats__main-user-lastseen">12 hours ago</span>
                                </div>
                            </div>

                            <ButtonLink to="/" className={'chats__main-settings'}>
                                <img src={settingsIcon} width={40} height={40} loading='lazy' alt="" className="chats__main-settings-icon" />
                            </ButtonLink>
                        </header>


                        <div className="chats__correspondence">
                            <div className="chats__message chats__message--my">
                                <span className="chats__message-text chats__message-text--my">Hello bro u so good u know? </span>
                                <span className="chats__message-time chats__message-time--my">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello bro u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>
                            <div className="chats__message chats__message--my">
                                <span className="chats__message-text chats__message-text--my">Hello bro u so good u know? </span>
                                <span className="chats__message-time chats__message-time--my">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello bro u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>
                            <div className="chats__message chats__message--my">
                                <span className="chats__message-text chats__message-text--my">Hello bro u so good u know? </span>
                                <span className="chats__message-time chats__message-time--my">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello bro u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>
                            <div className="chats__message chats__message--my">
                                <span className="chats__message-text chats__message-text--my">Hello bro  so good u know? Hello bro  so good u know?Hello bro  so good u know?Hello bro  so good u know?</span>
                                <span className="chats__message-time chats__message-time--my">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello br bro  so good u know?Hello bro bro  so good u know?Hello bro bro  so good u know?Hello broo u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello br bro  so good u know?Hello bro bro  so good u know?Hello bro bro  so good u know?Hello broo u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello br bro  so good u know?Hello bro bro  so good u know?Hello bro bro  so good u know?Hello broo u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello br bro  so good u know?Hello bro bro  so good u know?Hello bro bro  so good u know?Hello broo u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello br bro  so good u know?Hello bro bro  so good u know?Hello bro bro  so good u know?Hello broo u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>

                            <div className="chats__message chats__message--foreign">
                                <span className="chats__message-text chats__message-text--foreign">Hello br bro  so good u knod u know?Hellod u know?Hellow?Hello bro bro  so good u know?Hello bro bro  so good u know?Hello broo u so good u know?</span>
                                <span className="chats__message-time chats__message-time--foreign">12:12 pm</span>
                            </div>
                        </div>

                        <div className="chats__send">
                            <input type="text" className="chats__send-input" placeholder='Write a message..' />
                            <div className="chats__buttons">
                                <div className="chats__actions">
                                    <ButtonLink
                                        type="button"
                                        className="chats__attach"
                                        onClick={() => { }}
                                        aria-label="Attach media"
                                    >
                                        <img src={fileIcon} alt="" width={51} height={40} loading="lazy" />
                                    </ButtonLink>
                                    <ButtonLink
                                        type="submit"
                                        className="chats__send-button"
                                        aria-label="Send message"
                                    >
                                        <img className="chats__send-button-icon" src={sendIcon} alt="" width={51} height={40} loading="lazy" />
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

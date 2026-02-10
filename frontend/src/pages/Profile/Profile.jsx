import { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import PostList from "../../components/Post/PostList.jsx";
import PostComposer from "../../components/PostComposer/PostComposer.jsx";
import OrganizationList from "../../components/Organization/OrganizationList.jsx";

import avatar from "../../assets/images/Profile/avatar.png"
import settingsIcon from "../../assets/images/Profile/settings.svg"
import reportIcon from "../../assets/images/Profile/report.svg"
import close from "../../assets/images/Close.svg";
import profile from "../../assets/images/Settings/profile.svg"
import logout from "../../assets/images/Settings/logout.svg"
import admin from "../../assets/images/Settings/admin.svg"

export default function Profile() {
    const [activeTab, setActiveTab] = useState('posts');

    const organizations = [
        {
            id: 1,
            name: 'OpenAI Research',
            followers: '120k followers',
        },
        {
            id: 2,
            name: 'Aspect Technologies',
            followers: '85k followers',
        },
        {
            id: 3,
            name: 'Frontend Masters',
            followers: '64k followers',
        },
        {
            id: 4,
            name: 'Design Studio',
            followers: '42k followers',
        },
    ];

    return (
        <>
            <Header />
            <div className="profile block container">
                <div className="profile__inner block__inner">
                    <div className="profile__data">
                        <div className="profile__info-wrapper">
                            <div className="profile__info">
                                <img src={avatar} alt='avatar' width={80} height={80} loading='lazy' className="profile__avatar" />
                                <div className="profile__info-text">
                                    <h1 className="profile__nickname">Donald Trump</h1>
                                    <span className="profile__username">@donaldtrump</span>
                                </div>
                            </div>
                            <div className="profile__info-buttons">
                                <ButtonLink className="profile__info-button">
                                    <img src={reportIcon} width={60} height={60} loading={'lazy'} alt="" className="profile__info-button-icon" />
                                </ButtonLink>
                                <ButtonLink
                                    className="profile__info-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('settingsOverlay')?.showModal();
                                    }}
                                >
                                    <img src={settingsIcon} width={60} height={60} loading={'lazy'} alt="" className="profile__info-button-icon" />
                                </ButtonLink>
                            </div>
                        </div>

                        <dialog className="settings-overlay" id='settingsOverlay'>
                            <div className="settings-overlay__inner">
                                <header className="settings-overlay__header">
                                    <h1 className="settings-overlay__title">Settings</h1>

                                    <form method='dialog' className="settings-overlay__close-button-wrapper">
                                        <ButtonLink className={'settings-overlay__close-button'} type={'submit'}>
                                            <img src={close} width={24} height={24} loading='lazy' alt="" className="settings-overlay__close-button-icon cross-button" />
                                        </ButtonLink>
                                    </form>
                                </header>

                                <div className="settings-overlay__body">
                                    <ul className="settings-overlay__list">
                                        <li className="settings-overlay__item">
                                            <ButtonLink to={'/'} className={'settings-overlay__button settings-overlay__profile-info'}>
                                                <img src={profile} loading='lazy' width={44} height={44} alt="" className="settings-overlay__button-icon" />

                                                <div className="settings-overlay__button-body">
                                                    <h1 className="settings-overlay__button-title">Profile Info</h1>
                                                    <span className="settings-overlay__button-description">Change profile data</span>
                                                </div>
                                            </ButtonLink>
                                        </li>

                                        <li className="settings-overlay__item">
                                            <ButtonLink to={'/admin/stats'} className={'settings-overlay__button settings-overlay__dark-theme'}>
                                                <img src={admin} loading='lazy' width={44} height={44} alt="" className="settings-overlay__button-icon" />

                                                <div className="settings-overlay__button-body">
                                                    <h1 className="settings-overlay__button-title">Admin Panel</h1>
                                                    <span className="settings-overlay__button-description">Welcome back, MMU</span>
                                                </div>
                                            </ButtonLink>
                                        </li>

                                        <li className="settings-overlay__item">
                                            <ButtonLink to={'/'} className={'settings-overlay__button settings-overlay__logout'}>
                                                <img src={logout} loading='lazy' width={44} height={44} alt="" className="settings-overlay__button-icon" />

                                                <div className="settings-overlay__button-body">
                                                    <h1 className="settings-overlay__button-title settings-overlay__logout-title">Logout</h1>
                                                    <span className="settings-overlay__button-description settings-overlay__logout-description">Come back soon</span>
                                                </div>
                                            </ButtonLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </dialog>

                        <div className="profile__stats">
                            <ul className="profile__stats-list">
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">253.4k</span>
                                    <span className="profile__stats-title">Followers</span>
                                </li>
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">43</span>
                                    <span className="profile__stats-title">Following</span>
                                </li>
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">546</span>
                                    <span className="profile__stats-title">Posts</span>
                                </li>
                            </ul>
                        </div>

                        <div className="profile__buttons">
                            <ButtonLink to="/" className="profile__button profile__subscribe">
                                Subscribe
                            </ButtonLink>
                            <ButtonLink to="/" className="profile__button profile__message">
                                Message
                            </ButtonLink>
                        </div>
                    </div>

                    <div className="profile__tabs">
                        <button
                            type="button"
                            className={`profile__tab ${activeTab === 'posts' ? 'profile__tab--active' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        <button
                            type="button"
                            className={`profile__tab ${activeTab === 'organizations' ? 'profile__tab--active' : ''}`}
                            onClick={() => setActiveTab('organizations')}
                        >
                            Organizations
                        </button>
                    </div>

                    <div className="profile__content">
                        {activeTab === 'posts' && (
                            <>
                                <PostComposer />
                                <PostList posts={[
                                    { id: 1 },
                                    { id: 2 },
                                    { id: 3 },
                                ]} />
                            </>
                        )}

                        {activeTab === 'organizations' && (
                            <div className="profile__organizations">
                                <OrganizationList
                                    organizations={organizations}
                                    className="profile__organizations-list"
                                    classNameItem="profile__organizations-item"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

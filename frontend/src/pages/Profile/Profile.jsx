import { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import avatar from "../../assets/images/Profile/avatar.png"
import settingsIcon from "../../assets/images/Profile/settings.svg"
import reportIcon from "../../assets/images/Profile/report.svg"
import ButtonLink from "../../components/Button/Button.jsx";
import PostList from "../../components/Post/PostList.jsx";
import PostComposer from "../../components/PostComposer/PostComposer.jsx";


export default function Profile() {
    const [activeTab, setActiveTab] = useState('posts');
    return (
        <>
            <Header />
            <div className="profile block container">
                <div className="profile__inner block__inner">
                    <div className="profile__data">
                        <div className="profile__info-wrapper">
                            <div className="profile__info">
                                <img src={avatar} alt='avatar' width={80} height={80} loading='lazy' className="profile__avatar"/>
                                <div className="profile__info-text">
                                    <h1 className="profile__nickname">Donald Trump</h1>
                                    <span className="profile__username">@donaldtrump</span>
                                </div>
                            </div>
                            <div className="profile__info-buttons">
                                <ButtonLink to="/" className="profile__info-button">
                                    <img src={reportIcon} alt="" className="profile__info-button-icon"/>
                                </ButtonLink>
                                <ButtonLink to="/" className="profile__info-button">
                                    <img src={settingsIcon} alt="" className="profile__info-button-icon"/>
                                </ButtonLink>
                            </div>
                        </div>

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
                        <PostComposer />
                        <PostList posts={[
                            { id: 1 },
                            { id: 2 },
                            { id: 3 },
                        ]} />
                    </div>
                </div>
            </div>
        </>
    );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
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

import { usersApi } from "../../api/usersApi.js";
import { postsApi } from "../../api/postsApi.js";
import { subscriptionsApi } from "../../api/subscriptionsApi.js";

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

export default function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { logout: doLogout } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const isOwnProfile = !userId;

    const fetchUser = async () => {
        try {
            const currentUserData = await usersApi.getCurrentUser();
            setCurrentUser(currentUserData);

            if (userId) {
                const profileData = await usersApi.getUserById(userId);
                setUser(profileData);
                setIsFollowing(profileData.is_following || false);
            } else {
                setUser(currentUserData);
            }
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const authorId = userId || currentUser?.id;
            if (!authorId) return;
            
            const data = await postsApi.getPosts(100, 0);
            const postsArray = Array.isArray(data) ? data : (data?.results || []);
            
            const userPosts = postsArray.filter(post => post.author?.id === parseInt(authorId));
            setPosts(userPosts);
        } catch (err) {
            console.error('Error fetching user posts:', err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    useEffect(() => {
        if (user) {
            fetchUserPosts();
        }
    }, [user]);

    if (!user) {
        return null;
    }

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
                                <img src={user.avatar || avatar} alt='avatar' width={80} height={80} loading='lazy' className="profile__avatar" />
                                <div className="profile__info-text">
                                    <h1 className="profile__nickname">{user.nickname || user.username}</h1>
                                    <span className="profile__username">@{user.username}</span>
                                </div>
                            </div>
                            <div className="profile__info-buttons">
                                {!isOwnProfile && (
                                    <ButtonLink className="profile__info-button">
                                        <img src={reportIcon} width={60} height={60} loading={'lazy'} alt="" className="profile__info-button-icon" />
                                    </ButtonLink>
                                )}
                                {isOwnProfile && (
                                    <ButtonLink
                                        className="profile__info-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('settingsOverlay')?.showModal();
                                        }}
                                    >
                                        <img src={settingsIcon} width={60} height={60} loading={'lazy'} alt="" className="profile__info-button-icon" />
                                    </ButtonLink>
                                )}
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
                                            <ButtonLink onClick={async () => { await doLogout(); navigate('/sign-in'); }} className={'settings-overlay__button settings-overlay__logout'}>
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
                                    <span className="profile__stats-value">{formatNumber(user.followers_count || 0)}</span>
                                    <span className="profile__stats-title">Followers</span>
                                </li>
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">{formatNumber(user.following_count || 0)}</span>
                                    <span className="profile__stats-title">Following</span>
                                </li>
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">{formatNumber(user.post_count || 0)}</span>
                                    <span className="profile__stats-title">Posts</span>
                                </li>
                            </ul>
                        </div>

                        {!isOwnProfile && (
                            <div className="profile__buttons">
                                <button
                                    type="button"
                                    className={`profile__button profile__subscribe ${isFollowing ? 'profile__subscribe--active' : ''}`}
                                    onClick={async () => {
                                        if (isToggling) return;
                                        setIsToggling(true);
                                        try {
                                            if (isFollowing) {
                                                await subscriptionsApi.unsubscribe(user.id);
                                                setIsFollowing(false);
                                                setUser(prev => ({
                                                    ...prev,
                                                    followers_count: (prev.followers_count || 1) - 1,
                                                }));
                                            } else {
                                                await subscriptionsApi.subscribe(user.id);
                                                setIsFollowing(true);
                                                setUser(prev => ({
                                                    ...prev,
                                                    followers_count: (prev.followers_count || 0) + 1,
                                                }));
                                            }
                                        } catch (err) {
                                            console.error('Error toggling subscription:', err);
                                        } finally {
                                            setIsToggling(false);
                                        }
                                    }}
                                    disabled={isToggling}
                                >
                                    {isFollowing ? 'Unsubscribe' : 'Subscribe'}
                                </button>
                                <ButtonLink to="/" className="profile__button profile__message">
                                    Message
                                </ButtonLink>
                            </div>
                        )}
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
                                {isOwnProfile && <PostComposer onSubmit={async (content, images) => {
                                    try {
                                        const newPost = await postsApi.createPost({ content, images });
                                        setPosts([newPost, ...posts]);
                                    } catch (err) {
                                        console.error('Error creating post:', err);
                                        alert('Failed to create post');
                                    }
                                }} />}
                                <PostList
                                    posts={posts}
                                    currentUserId={currentUser?.id}
                                    onDelete={(postId) => setPosts(prev => prev.filter(p => p.id !== postId))}
                                />
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

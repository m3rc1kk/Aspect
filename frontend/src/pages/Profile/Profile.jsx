import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import PostList from "../../components/Post/PostList.jsx";
import PostComposer from "../../components/PostComposer/PostComposer.jsx";
import OrganizationList from "../../components/Organization/OrganizationList.jsx";
import Input from "../../components/Input/Input.jsx";
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload.jsx";

import settingsIcon from "../../assets/images/Profile/settings.svg"
import reportIcon from "../../assets/images/Profile/report.svg"
import close from "../../assets/images/Close.svg";
import profile from "../../assets/images/Settings/profile.svg"
import logout from "../../assets/images/Settings/logout.svg"
import admin from "../../assets/images/Settings/admin.svg"

import { usersApi } from "../../api/usersApi.js";
import { postsApi } from "../../api/postsApi.js";
import { subscriptionsApi } from "../../api/subscriptionsApi.js";
import { organizationsApi } from "../../api/organizationsApi.js";
import ReportModal from "../../components/ReportModal/ReportModal.jsx";
import AwardIcon from "../../components/AwardIcon/AwardIcon.jsx";

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
    const { logout: doLogout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [settingsView, setSettingsView] = useState('menu');
    const [editUsername, setEditUsername] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [editAvatar, setEditAvatar] = useState(null);
    const [editError, setEditError] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [showCreateOrg, setShowCreateOrg] = useState(false);
    const [orgUsername, setOrgUsername] = useState('');
    const [orgNickname, setOrgNickname] = useState('');
    const [orgAvatar, setOrgAvatar] = useState(null);
    const [orgError, setOrgError] = useState('');
    const [orgLoading, setOrgLoading] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const fetchUser = async () => {
        try {
            const currentUserData = await usersApi.getCurrentUser();
            setCurrentUser(currentUserData);

            if (userId && parseInt(userId) !== currentUserData.id) {
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

    const isOwnProfile = !userId || (currentUser && parseInt(userId) === currentUser.id);

    const fetchUserPosts = async () => {
        try {
            const authorId = userId || currentUser?.id;
            if (!authorId) return;
            
            const data = await postsApi.getPosts(100, 0, { author: authorId });
            const postsArray = Array.isArray(data) ? data : (data?.results || []);
            const userPosts = postsArray.filter(post => !post.organization);
            setPosts(userPosts);
        } catch (err) {
            console.error('Error fetching user posts:', err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const ownerId = userId || currentUser?.id;
            if (!ownerId) return;
            const data = await organizationsApi.getByOwner(ownerId);
            const orgsArray = Array.isArray(data) ? data : (data?.results || []);
            setOrganizations(orgsArray);
        } catch (err) {
            console.error('Error fetching organizations:', err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    useEffect(() => {
        if (user) {
            fetchUserPosts();
            fetchOrganizations();
        }
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <>
            <Header />
            <div className="profile block container">
                <div className="profile__inner block__inner">
                    <div className="profile__data">
                        <div className="profile__info-wrapper">
                            <div className="profile__info">
                                {user.avatar && <img src={user.avatar} alt='avatar' width={80} height={80} loading='lazy' className="profile__avatar" />}
                                <div className="profile__info-text">
                                    <h1 className="profile__nickname">
                                        {user.nickname || user.username}
                                        {user.badge && (
                                            <span className="badge">{user.badge}</span>
                                        )}
                                        {user.awards?.length > 0 && (
                                            <AwardIcon awards={user.awards} className="award-icon-wrap--profile" />
                                        )}
                                    </h1>
                                    <span className="profile__username">@{user.username}</span>
                                </div>
                            </div>
                            <div className="profile__info-buttons">
                                {!isOwnProfile && (
                                    <ButtonLink
                                        className="profile__info-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowReportModal(true);
                                        }}
                                    >
                                        <img src={reportIcon} width={60} height={60} loading={'lazy'} alt="" className="profile__info-button-icon" />
                                    </ButtonLink>
                                )}
                                {isOwnProfile && (
                                    <ButtonLink
                                        className="profile__info-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSettingsView('menu');
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
                                    {settingsView === 'menu' && (
                                        <ul className="settings-overlay__list">
                                            <li className="settings-overlay__item">
                                                <ButtonLink onClick={() => {
                                                    setEditUsername(user?.username || '');
                                                    setEditNickname(user?.nickname || '');
                                                    setEditAvatar(null);
                                                    setEditError('');
                                                    setSettingsView('edit');
                                                }} className={'settings-overlay__button settings-overlay__profile-info'}>
                                                    <img src={profile} loading='lazy' width={44} height={44} alt="" className="settings-overlay__button-icon" />
                                                    <div className="settings-overlay__button-body">
                                                        <h1 className="settings-overlay__button-title">Profile Info</h1>
                                                        <span className="settings-overlay__button-description">Change profile data</span>
                                                    </div>
                                                </ButtonLink>
                                            </li>

                                            {user?.is_staff && (
                                                <li className="settings-overlay__item">
                                                    <ButtonLink to={'/admin/stats'} className={'settings-overlay__button settings-overlay__dark-theme'}>
                                                        <img src={admin} loading='lazy' width={44} height={44} alt="" className="settings-overlay__button-icon" />
                                                        <div className="settings-overlay__button-body">
                                                            <h1 className="settings-overlay__button-title">Admin Panel</h1>
                                                            <span className="settings-overlay__button-description">Welcome back, MMU</span>
                                                        </div>
                                                    </ButtonLink>
                                                </li>
                                            )}

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
                                    )}

                                    {settingsView === 'edit' && (
                                        <div className="settings-overlay__form-wrap">
                                            <AvatarUpload onImageChange={setEditAvatar} />
                                            <Input
                                                id="edit-username"
                                                label="Username"
                                                type="text"
                                                placeholder="@ user"
                                                className="form__field"
                                                value={`@ ${editUsername}`}
                                                onChange={(e) => {
                                                    let next = String(e.target.value ?? '');
                                                    next = next.replace(/^@ ?/, '').replace(/@/g, '');
                                                    setEditUsername(next.trimStart());
                                                }}
                                            />
                                            <Input
                                                id="edit-nickname"
                                                label="Nickname"
                                                type="text"
                                                placeholder="Ivan Ivanov"
                                                className="form__field"
                                                value={editNickname}
                                                onChange={(e) => setEditNickname(e.target.value)}
                                            />
                                            {editError && (
                                                <p className="settings-overlay__error" style={{ color: '#c0392b', fontSize: 14, margin: 0, textAlign: 'center' }}>
                                                    {editError}
                                                </p>
                                            )}
                                            <ButtonLink
                                                type="button"
                                                className="form__button button__form"
                                                onClick={async () => {
                                                    setEditError('');
                                                    if (!editUsername.trim() || !editNickname.trim()) {
                                                        setEditError('Please fill in all fields');
                                                        return;
                                                    }
                                                    setEditLoading(true);
                                                    try {
                                                        const payload = {
                                                            username: editUsername.trim(),
                                                            nickname: editNickname.trim(),
                                                        };
                                                        if (editAvatar) payload.avatar = editAvatar;
                                                        const updated = await usersApi.updateProfile(payload);
                                                        setUser(prev => ({ ...prev, ...updated }));
                                                        updateUser(updated);
                                                        setSettingsView('menu');
                                                        document.getElementById('settingsOverlay')?.close();
                                                    } catch (err) {
                                                        const data = err.response?.data;
                                                        if (data?.username) setEditError(data.username[0]);
                                                        else if (data?.nickname) setEditError(data.nickname[0]);
                                                        else if (data?.avatar) setEditError(data.avatar[0]);
                                                        else setEditError('Failed to update profile');
                                                    } finally {
                                                        setEditLoading(false);
                                                    }
                                                }}
                                            >
                                                Save Changes
                                            </ButtonLink>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </dialog>

                        {!isOwnProfile && (
                            <ReportModal
                                isOpen={showReportModal}
                                onClose={() => setShowReportModal(false)}
                                targetType="USER"
                                targetId={user?.id}
                            />
                        )}

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
                                {isOwnProfile && !showCreateOrg && (
                                    <button
                                        type="button"
                                        className="profile__create-org-btn"
                                        onClick={() => {
                                            setShowCreateOrg(true);
                                            setOrgUsername('');
                                            setOrgNickname('');
                                            setOrgAvatar(null);
                                            setOrgError('');
                                        }}
                                    >
                                        + Create Organization
                                    </button>
                                )}

                                {showCreateOrg && (
                                    <div className="profile__create-org-form">
                                        <h3 style={{ margin: '0 0 12px' }}>New Organization</h3>
                                        <AvatarUpload onImageChange={setOrgAvatar} />
                                        <Input
                                            id="org-username"
                                            label="Username"
                                            type="text"
                                            placeholder="@ organization"
                                            className="form__field"
                                            value={`@ ${orgUsername}`}
                                            onChange={(e) => {
                                                let next = String(e.target.value ?? '');
                                                next = next.replace(/^@ ?/, '').replace(/@/g, '');
                                                setOrgUsername(next.trimStart());
                                            }}
                                        />
                                        <Input
                                            id="org-nickname"
                                            label="Name"
                                            type="text"
                                            placeholder="Organization Name"
                                            className="form__field"
                                            value={orgNickname}
                                            onChange={(e) => setOrgNickname(e.target.value)}
                                        />
                                        {orgError && (
                                            <p className="settings-overlay__error" style={{ color: '#c0392b', fontSize: 14, margin: 0, textAlign: 'center' }}>
                                                {orgError}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                type="button"
                                                className="profile__create-org-cancel"
                                                onClick={() => setShowCreateOrg(false)}
                                            >
                                                Cancel
                                            </button>
                                            <ButtonLink
                                                type="button"
                                                className="form__button button__form"
                                                onClick={async () => {
                                                    setOrgError('');
                                                    if (!orgUsername.trim() || !orgNickname.trim()) {
                                                        setOrgError('Please fill in all fields');
                                                        return;
                                                    }
                                                    setOrgLoading(true);
                                                    try {
                                                        const payload = {
                                                            username: orgUsername.trim(),
                                                            nickname: orgNickname.trim(),
                                                        };
                                                        if (orgAvatar) payload.avatar = orgAvatar;
                                                        const newOrg = await organizationsApi.create(payload);
                                                        setOrganizations(prev => [newOrg, ...prev]);
                                                        setShowCreateOrg(false);
                                                    } catch (err) {
                                                        const data = err.response?.data;
                                                        if (data?.username) setOrgError(data.username[0]);
                                                        else if (data?.nickname) setOrgError(data.nickname[0]);
                                                        else if (data?.avatar) setOrgError(data.avatar[0]);
                                                        else setOrgError('Failed to create organization');
                                                    } finally {
                                                        setOrgLoading(false);
                                                    }
                                                }}
                                            >
                                                Create
                                            </ButtonLink>
                                        </div>
                                    </div>
                                )}

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

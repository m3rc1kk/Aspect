import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import PostList from "../../components/Post/PostList.jsx";
import PostComposer from "../../components/PostComposer/PostComposer.jsx";
import Input from "../../components/Input/Input.jsx";
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload.jsx";

import settingsIcon from "../../assets/images/Profile/settings.svg";
import close from "../../assets/images/Close.svg";
import profile from "../../assets/images/Settings/profile.svg";
import deleteIcon from "../../assets/images/Settings/delete.svg";
import verifIcon from "../../assets/images/verif.svg";

import { usersApi } from "../../api/usersApi.js";
import { postsApi } from "../../api/postsApi.js";
import { organizationsApi } from "../../api/organizationsApi.js";
import { subscriptionsApi } from "../../api/subscriptionsApi.js";

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

export default function OrganizationProfile() {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [org, setOrg] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [settingsView, setSettingsView] = useState('menu');
    const [editUsername, setEditUsername] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [editAvatar, setEditAvatar] = useState(null);
    const [editError, setEditError] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const isOwner = currentUser && org?.owner?.id === currentUser.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orgData, userData] = await Promise.all([
                    organizationsApi.getById(orgId),
                    usersApi.getCurrentUser(),
                ]);
                setOrg(orgData);
                setCurrentUser(userData);
                setIsFollowing(orgData?.is_following ?? false);
            } catch (err) {
                console.error('Error fetching organization:', err);
            }
        };
        fetchData();
    }, [orgId]);

    useEffect(() => {
        if (!org) return;
        const fetchPosts = async () => {
            try {
                const data = await postsApi.getPosts(100, 0);
                const postsArray = Array.isArray(data) ? data : (data?.results || []);
                const orgPosts = postsArray.filter(p => p.organization?.id === org.id);
                setPosts(orgPosts);
            } catch (err) {
                console.error('Error fetching org posts:', err);
            }
        };
        fetchPosts();
    }, [org]);

    if (!org) return null;

    const handleDelete = async () => {
        try {
            await organizationsApi.delete(org.id);
            navigate('/profile');
        } catch (err) {
            console.error('Error deleting organization:', err);
        }
    };

    return (
        <>
            <Header />
            <div className="profile block container">
                <div className="profile__inner block__inner">
                    <div className="profile__data">
                        <div className="profile__info-wrapper">
                            <div className="profile__info">
                                {org.avatar && (
                                    <img
                                        src={org.avatar}
                                        alt="avatar"
                                        width={80}
                                        height={80}
                                        loading="lazy"
                                        className="profile__avatar"
                                    />
                                )}
                                <div className="profile__info-text">
                                    <h1 className="profile__nickname">
                                        {org.nickname || org.username}
                                        {org.is_verified && (
                                            <span className="verified-icon verified-icon--org-profile" aria-hidden="true">
                                                <img src={verifIcon} alt="" width={23} height={23} />
                                            </span>
                                        )}
                                    </h1>
                                    <span className="profile__username">@{org.username}</span>
                                </div>
                            </div>
                            <div className="profile__info-buttons">
                                {isOwner && (
                                    <ButtonLink
                                        className="profile__info-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSettingsView('menu');
                                            setShowDeleteConfirm(false);
                                            document.getElementById('orgSettingsOverlay')?.showModal();
                                        }}
                                    >
                                        <img src={settingsIcon} width={60} height={60} loading="lazy" alt="" className="profile__info-button-icon" />
                                    </ButtonLink>
                                )}
                            </div>
                        </div>

                        {isOwner && (
                            <dialog className="settings-overlay" id="orgSettingsOverlay">
                                <div className="settings-overlay__inner">
                                    <header className="settings-overlay__header">
                                        <h1 className="settings-overlay__title">
                                            {settingsView === 'edit' ? 'Edit Organization' : 'Settings'}
                                        </h1>
                                        <form method="dialog" className="settings-overlay__close-button-wrapper">
                                            <ButtonLink className="settings-overlay__close-button" type="submit">
                                                <img src={close} width={24} height={24} loading="lazy" alt="" className="settings-overlay__close-button-icon cross-button" />
                                            </ButtonLink>
                                        </form>
                                    </header>

                                    <div className="settings-overlay__body">
                                        {settingsView === 'menu' ? (
                                            <ul className="settings-overlay__list">
                                                <li className="settings-overlay__item">
                                                    <ButtonLink
                                                        onClick={() => {
                                                            setEditUsername(org.username || '');
                                                            setEditNickname(org.nickname || '');
                                                            setEditAvatar(null);
                                                            setEditError('');
                                                            setSettingsView('edit');
                                                        }}
                                                        className="settings-overlay__button settings-overlay__profile-info"
                                                    >
                                                        <img src={profile} loading="lazy" width={44} height={44} alt="" className="settings-overlay__button-icon" />
                                                        <div className="settings-overlay__button-body">
                                                            <h1 className="settings-overlay__button-title">Edit Info</h1>
                                                            <span className="settings-overlay__button-description">Change organization data</span>
                                                        </div>
                                                    </ButtonLink>
                                                </li>
                                                <li className="settings-overlay__item">
                                                    <ButtonLink
                                                        onClick={() => {
                                                            document.getElementById('orgSettingsOverlay')?.close();
                                                            setShowDeleteConfirm(true);
                                                        }}
                                                        className="settings-overlay__button settings-overlay__logout"
                                                    >
                                                        <img src={deleteIcon} loading="lazy" width={44} height={44} alt="" className="settings-overlay__button-icon" />
                                                        <div className="settings-overlay__button-body">
                                                            <h1 className="settings-overlay__button-title settings-overlay__logout-title">Delete Organization</h1>
                                                            <span className="settings-overlay__button-description settings-overlay__logout-description">This cannot be undone</span>
                                                        </div>
                                                    </ButtonLink>
                                                </li>
                                            </ul>
                                        ) : (
                                            <div className="settings-overlay__form-wrap">
                                                <AvatarUpload onImageChange={setEditAvatar} />
                                                <Input
                                                    id="edit-org-username"
                                                    label="Username"
                                                    type="text"
                                                    placeholder="@ organization"
                                                    className="form__field"
                                                    value={`@ ${editUsername}`}
                                                    onChange={(e) => {
                                                        let next = String(e.target.value ?? '');
                                                        next = next.replace(/^@ ?/, '').replace(/@/g, '');
                                                        setEditUsername(next.trimStart());
                                                    }}
                                                />
                                                <Input
                                                    id="edit-org-nickname"
                                                    label="Name"
                                                    type="text"
                                                    placeholder="Organization Name"
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
                                                            const updated = await organizationsApi.update(org.id, payload);
                                                            setOrg(prev => ({ ...prev, ...updated }));
                                                            setSettingsView('menu');
                                                            document.getElementById('orgSettingsOverlay')?.close();
                                                        } catch (err) {
                                                            const data = err.response?.data;
                                                            if (data?.username) setEditError(data.username[0]);
                                                            else if (data?.nickname) setEditError(data.nickname[0]);
                                                            else if (data?.avatar) setEditError(data.avatar[0]);
                                                            else setEditError('Failed to update organization');
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
                        )}

                        {showDeleteConfirm && (
                            <div className="post__delete-overlay" onClick={() => setShowDeleteConfirm(false)}>
                                <div className="post__delete-modal" onClick={(e) => e.stopPropagation()}>
                                    <h2 className="post__delete-modal-title">Delete Organization</h2>
                                    <p className="post__delete-modal-text">Are you sure? This action cannot be undone.</p>
                                    <div className="post__delete-modal-buttons">
                                        <button
                                            className="post__delete-modal-btn post__delete-modal-btn--cancel"
                                            onClick={() => setShowDeleteConfirm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="post__delete-modal-btn post__delete-modal-btn--delete"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="profile__stats">
                            <ul className="profile__stats-list">
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">{formatNumber(org.followers_count || 0)}</span>
                                    <span className="profile__stats-title">Followers</span>
                                </li>
                                <li className="profile__stats-item">
                                    <span className="profile__stats-value">{formatNumber(posts.length)}</span>
                                    <span className="profile__stats-title">Posts</span>
                                </li>
                            </ul>
                        </div>

                        {!isOwner && (
                            <div className="profile__buttons">
                                <button
                                    type="button"
                                    className={`profile__button profile__subscribe ${isFollowing ? 'profile__subscribe--active' : ''}`}
                                    onClick={async () => {
                                        if (isToggling) return;
                                        setIsToggling(true);
                                        try {
                                            if (isFollowing) {
                                                await subscriptionsApi.unsubscribeFromOrganization(org.id);
                                                setIsFollowing(false);
                                                setOrg(prev => ({
                                                    ...prev,
                                                    followers_count: Math.max(0, (prev.followers_count || 1) - 1),
                                                }));
                                            } else {
                                                await subscriptionsApi.subscribeToOrganization(org.id);
                                                setIsFollowing(true);
                                                setOrg(prev => ({
                                                    ...prev,
                                                    followers_count: (prev.followers_count || 0) + 1,
                                                }));
                                            }
                                        } catch (err) {
                                            console.error('Error toggling org subscription:', err);
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

                        <div className="profile__org-owner">
                            <span className="profile__org-owner-label">Owner</span>
                            <Link to={currentUser?.id === org.owner?.id ? '/profile' : `/profile/${org.owner?.id}`} className="profile__org-owner-link">
                                {org.owner?.avatar && (
                                    <img
                                        src={org.owner.avatar}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="profile__org-owner-avatar"
                                    />
                                )}
                                <span className="profile__org-owner-name">{org.owner?.nickname || org.owner?.username}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="profile__content">
                        {isOwner && (
                            <PostComposer
                                placeholder={`Post as ${org.nickname || org.username}…`}
                                onSubmit={async (content, images) => {
                                    try {
                                        const newPost = await postsApi.createPost({
                                            content,
                                            images,
                                            organizationId: org.id,
                                        });
                                        setPosts(prev => [newPost, ...prev]);
                                    } catch (err) {
                                        console.error('Error creating post:', err);
                                        alert('Failed to create post');
                                    }
                                }}
                            />
                        )}
                        <PostList
                            posts={posts}
                            currentUserId={currentUser?.id}
                            onDelete={(postId) => setPosts(prev => prev.filter(p => p.id !== postId))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

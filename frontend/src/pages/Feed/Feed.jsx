import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import ButtonLink from "../../components/Button/Button.jsx";
import PostComposer from "../../components/PostComposer/PostComposer.jsx";
import PostList from "../../components/Post/PostList.jsx";
import UserList from "../../components/User/UserList.jsx";

import notif from '../../assets/images/Feed/notif.svg';
import { postsApi } from "../../api/postsApi.js";
import { usersApi } from "../../api/usersApi.js";
import { notificationsApi } from "../../api/notificationsApi.js";
import { getAvatarUrl } from "../../utils/avatar.js";


export default function Feed() {
    const { pathname } = useLocation();
    const [posts, setPosts] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const loadMoreRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) || null; }
        catch { return null; }
    });
    const [allUsers, setAllUsers] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchCurrentUser = async () => {
        try {
            const userData = await usersApi.getCurrentUser();
            setCurrentUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            console.error('Error fetching current user:', err);
            const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setCurrentUser(cachedUser);
        }
    };

    const parseCursor = (nextUrl) => {
        if (!nextUrl || typeof nextUrl !== 'string') return null;
        try {
            return nextUrl.startsWith('http') ? new URL(nextUrl).searchParams.get('cursor') : nextUrl;
        } catch {
            return null;
        }
    };

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await postsApi.getPosts(null);
            const list = data?.results ?? [];
            setPosts(list);
            setNextCursor(parseCursor(data?.next) ?? null);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setPosts([]);
            setNextCursor(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMorePosts = useCallback(async () => {
        if (!nextCursor || loadingMore) return;
        setLoadingMore(true);
        try {
            const data = await postsApi.getPosts(nextCursor);
            const list = data?.results ?? [];
            setPosts(prev => [...prev, ...list]);
            setNextCursor(parseCursor(data?.next) ?? null);
        } catch (err) {
            console.error('Error loading more posts:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [nextCursor, loadingMore]);

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && nextCursor && !loadingMore) loadMorePosts();
            },
            { rootMargin: '200px', threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [nextCursor, loadingMore, loadMorePosts]);

    const handlePostSubmit = async (content, images = []) => {
        try {
            const newPost = await postsApi.createPost({ content, images });
            setPosts([newPost, ...posts]);
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post. Please try again.');
        }
    };

    const handlePostDelete = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const fetchUsers = async () => {
        try {
            const data = await usersApi.getAll();
            const usersArray = Array.isArray(data) ? data : (data?.results || []);
            setAllUsers(usersArray);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationsApi.getUnreadCount();
            setUnreadCount(count);
        } catch {
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchPosts();
        fetchUsers();
        fetchUnreadCount();
    }, [fetchPosts]);

    useEffect(() => {
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (pathname === '/feed') fetchUnreadCount();
    }, [pathname]);

    const userName = currentUser?.nickname || currentUser?.username || 'User';

    return (
        <>
            <Header />
            <div className="feed block container">
                <div className="feed__inner block__inner">
                    <header className="feed__header">
                        <div className="feed__header-body">
                            <img src={getAvatarUrl(currentUser?.avatar)} width={60} height={60} alt="" className="feed__avatar" />
                            <div className="feed__header-info">
                                <h1 className="feed__hello">Hello, {userName}!</h1>
                                <span className="feed__description">Ready for fresh news?</span>
                            </div>
                        </div>
                        <ButtonLink className="feed__button-notif" to="/notifications">
                            <span className="feed__button-notif-wrap">
                                <img src={notif} width={60} height={60} loading="lazy" alt="" className="feed__button-notif-icon" />
                                {unreadCount > 0 && <span className="feed__notif-badge" aria-label={`${unreadCount} unread`} />}
                            </span>
                        </ButtonLink>
                    </header>

                    <PostComposer onSubmit={handlePostSubmit} />
                    {loading ? (
                        <p className="feed__loading">Loading feed…</p>
                    ) : (
                        <>
                            <PostList posts={posts} currentUserId={currentUser?.id} onDelete={handlePostDelete} />
                            {nextCursor && (
                                <div ref={loadMoreRef} className="feed__load-more-sentinel" aria-hidden="true" />
                            )}
                            {loadingMore && <p className="feed__loading-more">Loading more…</p>}
                        </>
                    )}
                    {allUsers.length > 0 && (
                        <UserList
                            className={'feed__user-list'}
                            users={allUsers}
                            title="You may like..."
                            description="Popular people"
                        />
                    )}
                </div>
            </div>
        </>
    );
}

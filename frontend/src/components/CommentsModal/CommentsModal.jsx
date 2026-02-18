import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import { commentsApi } from "../../api/commentsApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import defaultAvatar from '../../assets/images/Profile/avatar.png';

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOwnComment(author, currentUserId) {
    if (currentUserId == null) return false;
    const authorId = author != null && typeof author === 'object' ? author.id : author;
    if (authorId == null) return false;
    return Number(authorId) === Number(currentUserId);
}

function Reply({ reply, currentUserId, onDelete }) {
    const authorAvatar = reply.author?.avatar || defaultAvatar;
    const authorName = reply.author?.nickname || reply.author?.username || 'Unknown';
    const authorId = reply.author?.id ?? (typeof reply.author !== 'object' ? reply.author : null);
    const isOwn = isOwnComment(reply.author, currentUserId);
    const authorLink = isOwn ? '/profile' : `/profile/${authorId}`;

    return (
        <div className="post-comments__reply">
            <Link to={authorLink} className="post-comments__comment-avatar-link">
                <img src={authorAvatar} alt="" width={28} height={28} className="post-comments__comment-avatar" />
            </Link>
            <div className="post-comments__comment-body">
                <div className="post-comments__comment-header">
                    <Link to={authorLink} className="post-comments__comment-author">{authorName}</Link>
                    <span className="post-comments__comment-date">{formatDate(reply.created_at)}</span>
                </div>
                <p className="post-comments__comment-text">{reply.content}</p>
                {isOwn && (
                    <div className="post-comments__comment-actions">
                        <button
                            type="button"
                            className="post-comments__comment-action post-comments__comment-action--delete"
                            onClick={() => onDelete(reply.id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const CommentItem = forwardRef(function CommentItem({ comment, currentUserId, onReply, onDelete }, ref) {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [localRepliesCount, setLocalRepliesCount] = useState(comment.replies_count || 0);

    const authorAvatar = comment.author?.avatar || defaultAvatar;
    const authorName = comment.author?.nickname || comment.author?.username || 'Unknown';
    const authorId = comment.author?.id ?? (typeof comment.author !== 'object' ? comment.author : null);
    const isOwn = isOwnComment(comment.author, currentUserId);
    const authorLink = isOwn ? '/profile' : `/profile/${authorId}`;

    useImperativeHandle(ref, () => ({
        addReply: (reply) => {
            setReplies(prev => [...prev, reply]);
            setLocalRepliesCount(prev => prev + 1);
            setShowReplies(true);
        }
    }));

    const handleToggleReplies = async () => {
        if (showReplies) {
            setShowReplies(false);
            return;
        }
        setShowReplies(true);
        if (replies.length > 0) return;

        try {
            setLoadingReplies(true);
            const data = await commentsApi.getReplies(comment.id);
            setReplies(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Error loading replies:', err);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleDeleteReply = (replyId) => {
        onDelete(replyId);
        setReplies(prev => prev.filter(r => r.id !== replyId));
        setLocalRepliesCount(prev => prev - 1);
    };

    return (
        <div className="post-comments__comment">
            <Link to={authorLink} className="post-comments__comment-avatar-link">
                <img src={authorAvatar} alt="" width={36} height={36} className="post-comments__comment-avatar" />
            </Link>
            <div className="post-comments__comment-body">
                <div className="post-comments__comment-header">
                    <Link to={authorLink} className="post-comments__comment-author">{authorName}</Link>
                    <span className="post-comments__comment-date">{formatDate(comment.created_at)}</span>
                </div>
                <p className="post-comments__comment-text">{comment.content}</p>
                <div className="post-comments__comment-actions">
                    <button
                        type="button"
                        className="post-comments__comment-action"
                        onClick={() => onReply(comment.id, authorName)}
                    >
                        Reply
                    </button>
                    {isOwn && (
                        <button
                            type="button"
                            className="post-comments__comment-action post-comments__comment-action--delete"
                            onClick={() => onDelete(comment.id)}
                        >
                            Delete
                        </button>
                    )}
                </div>

                {localRepliesCount > 0 && (
                    <button
                        type="button"
                        className="post-comments__toggle-replies"
                        onClick={handleToggleReplies}
                    >
                        {showReplies ? 'Hide replies' : `View replies (${localRepliesCount})`}
                    </button>
                )}

                {showReplies && (
                    <div className="post-comments__replies">
                        {loadingReplies && <div className="post-comments__loader">Loading...</div>}
                        {replies.map(reply => (
                            <Reply
                                key={reply.id}
                                reply={reply}
                                currentUserId={currentUserId}
                                onDelete={handleDeleteReply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default function CommentsModal({ postId, onClose, onCommentsCountChange }) {
    const { user } = useAuth();
    const currentUserId = user?.id;

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const inputRef = useRef(null);
    const commentRefs = useRef({});

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await commentsApi.getComments(postId);
            setComments(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Error loading comments:', err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleReply = (commentId, authorName) => {
        setReplyTo({ id: commentId, name: authorName });
        inputRef.current?.focus();
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    const enrichCommentWithAuthor = (comment) => {
        const a = comment.author;
        if (a && typeof a === 'object' && (a.nickname != null || a.username != null)) return comment;
        return {
            ...comment,
            author: {
                id: user?.id,
                avatar: user?.avatar,
                nickname: user?.nickname,
                username: user?.username,
            },
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text || submitting) return;

        try {
            setSubmitting(true);
            const raw = await commentsApi.createComment(
                postId,
                text,
                replyTo?.id || null
            );
            const newComment = enrichCommentWithAuthor(raw);

            if (replyTo) {
                const ref = commentRefs.current[replyTo.id];
                if (ref?.addReply) {
                    ref.addReply(newComment);
                }
            } else {
                setComments(prev => [newComment, ...prev]);
            }

            setInputValue('');
            setReplyTo(null);
            onCommentsCountChange?.(1);
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await commentsApi.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            onCommentsCountChange?.(-1);
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="post-comments">
            <header className="post-comments__header">
                <button type="button" className="post-comments__close" onClick={onClose} aria-label="Collapse">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
            </header>

            <div className="post-comments__list">
                {loading && (
                    <div className="post-comments__loading">
                        <div className="post-comments__spinner" />
                    </div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="post-comments__empty">
                        No comments yet. Be the first to comment!
                    </div>
                )}

                    {!loading && comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            ref={(el) => { commentRefs.current[comment.id] = el; }}
                            comment={comment}
                            currentUserId={currentUserId}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))}
            </div>

            {currentUserId && (
                <form className="post-comments__form" onSubmit={handleSubmit}>
                    {replyTo && (
                        <div className="post-comments__reply-bar">
                            <span>Replying to <strong>{replyTo.name}</strong></span>
                            <button type="button" className="post-comments__reply-cancel" onClick={handleCancelReply}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="post-comments__input-row">
                        <input
                            ref={inputRef}
                            type="text"
                            className="post-comments__input"
                            placeholder={replyTo ? `Reply to ${replyTo.name}...` : 'Write a comment...'}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            maxLength={1000}
                        />
                        <button
                            type="submit"
                            className="post-comments__send"
                            disabled={!inputValue.trim() || submitting}
                            aria-label="Send"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ButtonLink from "../Button/Button.jsx";
import reportIcon from '../../assets/images/Post/report.svg'
import deleteIcon from '../../assets/images/Post/delete.svg'
import likeIcon from '../../assets/images/Post/like.svg'
import likeActiveIcon from '../../assets/images/Post/like-active.svg'
import commentIcon from '../../assets/images/Post/comment.svg'
import verifIcon from '../../assets/images/verif.svg'
import AwardIcon from '../AwardIcon/AwardIcon.jsx';
import { likesApi } from "../../api/likesApi.js";
import { postsApi } from "../../api/postsApi.js";
import CommentsModal from "../CommentsModal/CommentsModal.jsx";
import ReportModal from "../ReportModal/ReportModal.jsx";
import { getAvatarUrl } from "../../utils/avatar.js";

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes === 1) return '1 min ago';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInWeeks === 1) return '1 week ago';
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
}

function ImageLightbox({ images, startIndex, onClose }) {
    const [current, setCurrent] = useState(startIndex);

    const goNext = useCallback(() => {
        setCurrent(prev => (prev + 1) % images.length);
    }, [images.length]);

    const goPrev = useCallback(() => {
        setCurrent(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose, goNext, goPrev]);

    return (
        <div className="lightbox" onClick={onClose}>
            <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox__close" onClick={onClose} aria-label="Close">
                    &times;
                </button>

                {images.length > 1 && (
                    <button className="lightbox__nav lightbox__nav--prev" onClick={goPrev} aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                )}

                <img
                    src={images[current].image}
                    alt=""
                    className="lightbox__image"
                />

                {images.length > 1 && (
                    <button className="lightbox__nav lightbox__nav--next" onClick={goNext} aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}

                {images.length > 1 && (
                    <div className="lightbox__counter">
                        {current + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>
    );
}

function PostImageGrid({ images, onImageClick }) {
    const count = images.length;
    const displayCount = Math.min(count, 4);
    const displayImages = images.slice(0, displayCount);
    const remaining = count - displayCount;

    return (
        <div className={`post__images post__images--count-${Math.min(count, 5)}`}>
            {displayImages.map((img, index) => (
                <div
                    key={img.id || index}
                    className="post__image-cell"
                    onClick={() => onImageClick(index)}
                >
                    <img 
                        src={img.image} 
                        alt="" 
                        loading="lazy"
                        className="post__image"
                    />
                    {index === displayCount - 1 && remaining > 0 && (
                        <div className="post__image-more">
                            +{remaining}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function Post({ post, currentUserId, onLikeChange, onDelete }) {
    if (!post) return null;

    const [isLiked, setIsLiked] = useState(post.is_liked || false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
    const [showReport, setShowReport] = useState(false);

    const hasOrg = !!post.organization;
    const authorAvatar = hasOrg
        ? post.organization?.avatar
        : post.author?.avatar;
    const authorName = hasOrg
        ? (post.organization?.nickname || post.organization?.username)
        : (post.author?.nickname || post.author?.username || 'Unknown User');
    const authorId = post.author?.id;
    const isOwn = currentUserId && authorId === currentUserId;
    const postDate = formatDate(post.created_at);
    const commentsCountFormatted = formatNumber(commentsCount);
    const authorLink = hasOrg
        ? `/organization/${post.organization?.id}`
        : (isOwn ? '/profile' : `/profile/${authorId}`);

    const handleLikeClick = async (e) => {
        e.preventDefault();
        
        if (isLiking) return;

        const previousLiked = isLiked;
        const previousCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            setIsLiking(true);
            const result = await likesApi.toggleLike(post.id);
            
            setIsLiked(result.liked);
            
            onLikeChange?.(post.id, result.liked);
        } catch (error) {
            console.error('Error toggling like:', error);
            setIsLiked(previousLiked);
            setLikesCount(previousCount);
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        try {
            setIsDeleting(true);
            await postsApi.deletePost(post.id);
            onDelete?.(post.id);
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <>
            <div className="post">
                <div className="post__inner">
                    <header className="post__header">
                        <Link to={authorLink} className="post__author">
                            <img src={getAvatarUrl(authorAvatar)} width={40} height={40} loading="lazy" alt="" className="post__author-image" />
                            <div className="post__author-data">
                                <h1 className="post__author-nickname">
                                    {authorName}
                                    {hasOrg && post.organization?.is_verified && (
                                        <span className="verified-icon" aria-hidden="true">
                                            <img src={verifIcon} alt="" width={20} height={20} />
                                        </span>
                                    )}
                                    {!hasOrg && post.author?.badge && (
                                        <span className="badge">{post.author.badge}</span>
                                    )}
                                    {!hasOrg && post.author?.awards?.length > 0 && (
                                        <AwardIcon awards={post.author.awards} />
                                    )}
                                </h1>
                                <span className="post__date">{postDate}</span>
                            </div>
                        </Link>
                        <div className="post__header-buttons">
                            {isOwn && (
                                <button
                                    type="button"
                                    className="post__header-button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <img src={deleteIcon} alt="Delete" width={36} height={36} loading='lazy' className="post__header-button-icon"/>
                                </button>
                            )}
                            {!isOwn && (
                                <button
                                    type="button"
                                    className="post__header-button"
                                    onClick={() => setShowReport(true)}
                                >
                                    <img src={reportIcon} alt="Report" width={36} height={36} loading='lazy' className="post__header-button-icon"/>
                                </button>
                            )}
                        </div>
                    </header>

                    {showDeleteConfirm && (
                        <div className="post__delete-overlay">
                            <div className="post__delete-modal" onClick={(e) => e.stopPropagation()}>
                                <h2 className="post__delete-modal-title">Delete post</h2>
                                <p className="post__delete-modal-text">Are you sure you want to delete this post? This action cannot be undone.</p>
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
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <ReportModal
                        isOpen={showReport}
                        onClose={() => setShowReport(false)}
                        targetType="POST"
                        targetId={post.id}
                    />

                    {post.content && (
                        <div className="post__text">
                            <p>{post.content}</p>
                        </div>
                    )}

                    {post.images && post.images.length > 0 && (
                        <PostImageGrid
                            images={post.images}
                            onImageClick={(index) => setLightboxIndex(index)}
                        />
                    )}

                    {lightboxIndex !== null && post.images && (
                        <ImageLightbox
                            images={post.images}
                            startIndex={lightboxIndex}
                            onClose={() => setLightboxIndex(null)}
                        />
                    )}

                    <div className="post__buttons">
                        <button 
                            onClick={handleLikeClick}
                            disabled={isLiking}
                            className={`post__button ${isLiked ? 'post__button--active' : ''}`}
                        >
                            <img 
                                src={isLiked ? likeActiveIcon : likeIcon} 
                                alt="Like" 
                                width={28} 
                                height={28} 
                                loading='lazy' 
                                className="post__button-icon"
                            /> 
                            <span className="post__button-quantity">{formatNumber(likesCount)}</span>
                        </button>
                        <button
                            type="button"
                            className={`post__button ${showComments ? 'post__button--active' : ''}`}
                            onClick={() => setShowComments((prev) => !prev)}
                        >
                            <img src={commentIcon} alt="Comments" width={28} height={28} loading='lazy' className="post__button-icon"/> 
                            <span className="post__button-quantity">{commentsCountFormatted}</span>
                        </button>
                    </div>

                    {showComments && (
                        <CommentsModal
                            postId={post.id}
                            onClose={() => setShowComments(false)}
                            onCommentsCountChange={(delta) => setCommentsCount(prev => prev + delta)}
                            commentsCount={commentsCount}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
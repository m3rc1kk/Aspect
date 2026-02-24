import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../../utils/avatar.js';
import likeIcon from '../../assets/images/Notifications/like.svg';
import subscribeIcon from '../../assets/images/Notifications/subscribe.svg';

const ACTION_TEXT = {
    like: 'Liked your post',
    subscription: 'Subscribed to you',
};

const MAX_VISIBLE_TOASTS = 3;
const TOAST_AUTO_DISMISS_MS = 5000;
const POLL_INTERVAL_MS = 25000;

export { MAX_VISIBLE_TOASTS, TOAST_AUTO_DISMISS_MS, POLL_INTERVAL_MS };

export default function NotificationToast({ notification, onClose }) {
    if (!notification?.sender) return null;

    const { sender, notification_type } = notification;
    const avatarSrc = getAvatarUrl(sender.avatar);
    const actionText = ACTION_TEXT[notification_type] || notification_type;
    const iconSrc = notification_type === 'like' ? likeIcon : subscribeIcon;
    const to = `/profile/${sender.id}`;

    return (
        <div className="notification-toast" role="status">
            <Link to={to} className="notification-toast__link" onClick={onClose}>
                <img
                    src={avatarSrc}
                    width={40}
                    height={40}
                    alt=""
                    className="notification-toast__avatar"
                />
                <div className="notification-toast__text">
                    <span className="notification-toast__name">{sender.nickname || sender.username}</span>
                    <span className="notification-toast__action">{actionText}</span>
                </div>
                <span className={`notification-toast__icon-wrap notification-toast__icon-wrap--${notification_type}`}>
                    <img src={iconSrc} width={24} height={24} alt="" className="notification-toast__icon" />
                </span>
            </Link>
            <button
                type="button"
                className="notification-toast__close"
                onClick={(e) => { e.preventDefault(); onClose(); }}
                aria-label="Close"
            />
        </div>
    );
}

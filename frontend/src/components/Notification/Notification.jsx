import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../api/axiosConfig';
import avatarPlaceholder from '../../assets/images/Profile/avatar.png';
import likeIcon from '../../assets/images/Notifications/like.svg';
import subscribeIcon from '../../assets/images/Notifications/subscribe.svg';
import arrowIcon from '../../assets/images/Organization/arrow.svg';

const ACTION_TEXT = {
    like: 'Liked your post',
    subscription: 'Subscribed to you',
};

export default function Notification({ notification, onMarkRead }) {
    if (!notification?.sender) return null;

    const { sender, notification_type } = notification;
    const avatarSrc = getMediaUrl(sender.avatar) || avatarPlaceholder;
    const actionText = ACTION_TEXT[notification_type] || notification_type;
    const iconSrc = notification_type === 'like' ? likeIcon : subscribeIcon;
    const to = `/profile/${sender.id}`;

    const handleClick = () => {
        if (onMarkRead && !notification.read) onMarkRead(notification.id);
    };

    return (
        <div className={`notification ${notification.read ? 'notification--read' : ''}`}>
            <Link to={to} className="notification__inner" onClick={handleClick}>
                <div className="notification__author">
                    <img
                        src={avatarSrc}
                        width={42}
                        height={42}
                        loading="lazy"
                        alt=""
                        className="notification__avatar"
                    />
                    <div className="notification__author-body">
                        <h2 className="notification__username">{sender.nickname || sender.username}</h2>
                        <span className="notification__action">{actionText}</span>
                    </div>
                </div>
                <div className="notification__body">
                    <span className={`notification__icon-wrap notification__icon-wrap--${notification_type}`}>
                        <img src={iconSrc} width={28} height={28} loading="lazy" alt="" className="notification__icon" />
                    </span>
                    <img src={arrowIcon} width={12} height={24} loading="lazy" alt="" className="notification__arrow" />
                </div>
            </Link>
        </div>
    );
}

import Notification from './Notification.jsx';

export default function NotificationList({ notifications = [], className = '', onMarkRead }) {
    return (
        <div className={`notification-list ${className}`}>
            <ul className="notification-list__list">
                {notifications.map((notification) => (
                    <li key={notification.id} className="notification-list__item">
                        <Notification notification={notification} onMarkRead={onMarkRead} />
                    </li>
                ))}
            </ul>
        </div>
    );
}


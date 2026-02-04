import Notification from "./Notification.jsx";

export default function NotificationList({ notifications = [], className = '' }) {
    return (
        <>
            <div className={`notification-list ${className}`}>
                <ul className="notification-list__list">
                    {notifications.map((notification) => (
                        <li key={notification.id} className="notification-list__item">
                            <Notification />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}


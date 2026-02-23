import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import ButtonLink from '../../components/Button/Button.jsx';
import NotificationList from '../../components/Notification/NotificationList.jsx';
import { notificationsApi } from '../../api/notificationsApi.js';
import backIcon from '../../assets/images/Notifications/back.svg';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setError(null);
            const data = await notificationsApi.getList({ limit: 50 });
            const list = Array.isArray(data) ? data : (data?.results ?? []);
            setNotifications(list);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.response?.data?.detail || 'Failed to load notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <>
            <Header />
            <div className="notifications block container">
                <div className="notifications__inner block__inner">
                    <header className="notifications__header">
                        <ButtonLink to="/feed" className="notifications__link">
                            <img src={backIcon} width={36} height={36} loading="lazy" alt="" className="notifications__link-icon" />
                        </ButtonLink>
                        <h1 className="notifications__title">Notifications</h1>
                        {!loading && notifications.some((n) => !n.read) && (
                            <button
                                type="button"
                                className="notifications__read-all"
                                onClick={async () => {
                                    try {
                                        await notificationsApi.markAllRead();
                                        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                            >
                                Mark all as read
                            </button>
                        )}
                    </header>

                    <div className="notifications__body">
                        {loading && <p className="notifications__loading">Loading...</p>}
                        {error && <p className="notifications__error">{error}</p>}
                        {!loading && !error && notifications.length === 0 && (
                            <p className="notifications__empty">No notifications yet.</p>
                        )}
                        {!loading && !error && notifications.length > 0 && (
                            <NotificationList
                                notifications={notifications}
                                onMarkRead={async (id) => {
                                    try {
                                        await notificationsApi.markRead(id);
                                        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

import { useState, useEffect, useRef } from 'react';
import { notificationsApi } from '../../api/notificationsApi.js';
import NotificationToast, {
    MAX_VISIBLE_TOASTS,
    TOAST_AUTO_DISMISS_MS,
    POLL_INTERVAL_MS,
} from '../NotificationToast/NotificationToast.jsx';

function useNotificationsPolling(enabled) {
    const [toasts, setToasts] = useState([]);
    const seenIdsRef = useRef(new Set());
    const isFirstRunRef = useRef(true);
    const timeoutsRef = useRef([]);

    const dismissToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const processNotifications = (notifications) => {
        const newOnes = notifications.filter((n) => !seenIdsRef.current.has(n.id));
        newOnes.forEach((n) => seenIdsRef.current.add(n.id));
        if (isFirstRunRef.current) {
            isFirstRunRef.current = false;
            return;
        }
        if (newOnes.length === 0) return;
        setToasts((prev) => {
            const next = [...prev];
            newOnes.forEach((n) => next.push({ ...n, _key: `${n.id}-${Date.now()}` }));
            return next.slice(-(MAX_VISIBLE_TOASTS * 2));
        });
        newOnes.forEach((n) => {
            const t = setTimeout(() => dismissToast(n.id), TOAST_AUTO_DISMISS_MS);
            timeoutsRef.current.push(t);
        });
    };

    useEffect(() => {
        if (!enabled) return;

        const poll = async () => {
            try {
                const data = await notificationsApi.getList({ limit: 10 });
                const list = Array.isArray(data) ? data : (data?.results ?? []);
                processNotifications(list);
            } catch {
                // ignore
            }
        };

        poll();
        const intervalId = setInterval(poll, POLL_INTERVAL_MS);
        return () => {
            clearInterval(intervalId);
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, [enabled]);

    return { toasts, dismissToast };
}

export default function NotificationToasts() {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
    const { toasts, dismissToast } = useNotificationsPolling(hasToken);
    const visible = toasts.slice(-MAX_VISIBLE_TOASTS);

    if (visible.length === 0) return null;

    return (
        <div className="notification-toasts" aria-live="polite">
            {visible.map((toast) => (
                <NotificationToast
                    key={toast._key ?? toast.id}
                    notification={toast}
                    onClose={() => dismissToast(toast.id)}
                />
            ))}
        </div>
    );
}

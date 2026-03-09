import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";

const MOBILE_BREAKPOINT = 767;

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
    );
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        const handler = () => setIsMobile(mql.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);
    return isMobile;
}
import ButtonLink from "../../components/Button/Button.jsx";
import { getAvatarUrl } from "../../utils/avatar";
import { chatsApi } from "../../api/chatsApi";
import sendIcon from '../../assets/images/Chats/send.svg';
import settingsIcon from '../../assets/images/Chats/settings.svg';
import backIcon from "../../assets/images/Notifications/back.svg";

const getApiBase = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '');
    if (typeof window === 'undefined') return '';
    if (window.location.hostname === 'localhost' || window.location.port === '5173') return `${window.location.protocol}//${window.location.hostname}:8000`;
    return window.location.origin.replace(/\/$/, '');
};
const API_BASE = getApiBase();

function formatMessageTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chats() {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const wsRef = useRef(null);
    const correspondenceRef = useRef(null);

    const loadChats = useCallback(async () => {
        setLoadingChats(true);
        try {
            const data = await chatsApi.getChats();
            const list = Array.isArray(data) ? data : data.results || [];
            setChats(list);
            return list;
        } catch {
            setChats([]);
            return [];
        } finally {
            setLoadingChats(false);
        }
    }, []);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    const openChat = useCallback(async (chat) => {
        setActiveChat(chat);
        setMessages([]);
        setLoadingMessages(true);
        try {
            const data = await chatsApi.getMessages(chat.id);
            const list = data.results || (Array.isArray(data) ? data : []);
            setMessages(list.reverse());
        } catch {
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        const chatToOpen = location.state?.openChat;
        if (!chatToOpen) return;
        openChat(chatToOpen);
        setChats((prev) => (prev.some((c) => c.id === chatToOpen.id) ? prev : [chatToOpen, ...prev]));
        navigate('/chats', { replace: true, state: {} });
    }, [location.state?.openChat, openChat, navigate]);

    useEffect(() => {
        if (!activeChat) {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            return;
        }
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const protocol = API_BASE.startsWith('https') ? 'wss' : 'ws';
        const host = API_BASE.replace(/^https?:\/\//, '');
        const wsUrl = `${protocol}://${host}/ws/chats/${activeChat.id}/?token=${encodeURIComponent(token)}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                setMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            } catch { /* ignore parse error */ }
        };

        ws.onclose = () => {
            wsRef.current = null;
        };

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [activeChat]);

    const currentUserId = (() => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u).id : null;
        } catch {
            return null;
        }
    })();

    const sendMessage = useCallback(async () => {
        const text = (inputText || '').trim();
        if (!text || !activeChat || sending) return;
        setSending(true);
        setInputText('');
        const optId = `opt-${Date.now()}`;
        const optimisticMessage = {
            id: optId,
            text,
            created_at: new Date().toISOString(),
            is_mine: true,
            sender: currentUserId,
            sender_id: currentUserId,
        };
        setMessages((prev) => [...prev, optimisticMessage]);
        try {
            const msg = await chatsApi.sendMessage(activeChat.id, text);
            setMessages((prev) => {
                const withoutOpt = prev.filter((m) => m.id !== optId);
                if (withoutOpt.some((m) => m.id === msg.id)) return withoutOpt;
                return [...withoutOpt, { ...msg, sender_id: msg.sender ?? msg.sender_id }];
            });
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== optId));
            setInputText(text);
        } finally {
            setSending(false);
        }
    }, [activeChat, inputText, sending, currentUserId]);

    useEffect(() => {
        if (!correspondenceRef.current) return;
        correspondenceRef.current.scrollTop = correspondenceRef.current.scrollHeight;
    }, [messages]);

    const otherParticipant = activeChat?.other_participant;

    // На мобильном в открытом чате скрываем нижний navbar, чтобы было видно поле ввода
    const hideHeader = isMobile && !!activeChat;

    return (
        <>
            {!hideHeader && <Header />}
            <div className={`chats block container ${activeChat ? 'chats--detail' : ''}`}>
                <div className="chats__inner block__inner">
                    <div className="chats__menu">
                        <h1 className="chats__title">Chats</h1>
                        <ul className="chats__list">
                            {loadingChats ? (
                                <li className="chats__item chats__item--placeholder">Loading...</li>
                            ) : (
                                chats.length === 0 ? (
                                <li className="chats__item chats__item--placeholder">No chats yet</li>
                            ) : (
                                chats.map((chat) => (
                                    <li key={chat.id} className="chats__item">
                                        <ButtonLink
                                            type="button"
                                            className="chats__link"
                                            onClick={() => openChat(chat)}
                                        >
                                            <img
                                                src={getAvatarUrl(chat.other_participant?.avatar)}
                                                width={42}
                                                height={42}
                                                loading="lazy"
                                                alt=""
                                                className="chats__menu-avatar"
                                            />
                                            <div className="chats__menu-info">
                                                <h2 className="chats__menu-nickname" title={chat.other_participant?.nickname || 'User'}>
                                                    {(() => {
                                                        const n = chat.other_participant?.nickname || 'User';
                                                        return n.length > 14 ? n.slice(0, 14) + '…' : n;
                                                    })()}
                                                </h2>
                                                <span className="chats__menu-message">
                                                    {chat.last_message
                                                        ? chat.last_message.text?.slice(0, 40) + (chat.last_message.text?.length > 40 ? '...' : '')
                                                        : 'No messages yet'}
                                                </span>
                                            </div>
                                        </ButtonLink>
                                    </li>
                                ))
                            )
                            )}
                        </ul>
                    </div>

                    <div className="chats__main">
                        {activeChat && (
                        <header className="chats__main-header">
                            <button
                                type="button"
                                className="chats__back"
                                onClick={() => setActiveChat(null)}
                                aria-label="Back to chats list"
                            >
                                <img src={backIcon} alt="" width={36} height={36} className="chats__back-icon" />
                            </button>
                            <div className="chats__main-user">
                                <img
                                    src={getAvatarUrl(otherParticipant?.avatar)}
                                    height={42}
                                    width={42}
                                    loading="lazy"
                                    alt=""
                                    className="chats__main-avatar"
                                />
                                <div className="chats__main-user-info">
                                    <h1 className="chats__main-user-nickname" title={otherParticipant?.nickname || 'User'}>
                                        {(() => {
                                            const n = otherParticipant?.nickname || 'User';
                                            return n.length > 14 ? n.slice(0, 14) + '…' : n;
                                        })()}
                                    </h1>
                                    <span className="chats__main-user-lastseen">—</span>
                                </div>
                            </div>
                            <ButtonLink to="/" className="chats__main-settings">
                                <img src={settingsIcon} width={40} height={40} loading="lazy" alt="" className="chats__main-settings-icon" />
                            </ButtonLink>
                        </header>
                        )}

                        <div className="chats__correspondence" ref={correspondenceRef}>
                            {!activeChat ? (
                                <div className="chats__placeholder">Select a chat</div>
                            ) : loadingMessages ? (
                                <div>Loading messages...</div>
                            ) : (
                                messages.map((msg) => {
                                    const isMine = msg.is_mine ?? (msg.sender_id === currentUserId);
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`chats__message ${isMine ? 'chats__message--my' : 'chats__message--foreign'}`}
                                        >
                                            <span className={isMine ? 'chats__message-text chats__message-text--my' : 'chats__message-text chats__message-text--foreign'}>
                                                {msg.text}
                                            </span>
                                            <span className={isMine ? 'chats__message-time chats__message-time--my' : 'chats__message-time chats__message-time--foreign'}>
                                                {formatMessageTime(msg.created_at)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {activeChat && (
                        <div className="chats__send">
                            <input
                                type="text"
                                className="chats__send-input"
                                placeholder="Write a message.."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            />
                            <div className="chats__buttons">
                                <div className="chats__actions">
                                    <button
                                        type="button"
                                        className="chats__send-button"
                                        aria-label="Send message"
                                        onClick={sendMessage}
                                        disabled={sending}
                                    >
                                        <img className="chats__send-button-icon" src={sendIcon} alt="" width={51} height={40} loading="lazy" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

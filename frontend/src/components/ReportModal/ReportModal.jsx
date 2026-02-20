import { useState } from "react";
import { reportsApi } from "../../api/reportsApi.js";

const REPORT_REASONS = [
    { value: 'SPAM', label: 'Spam' },
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
    { value: 'MISINFORMATION', label: 'Misinformation' },
    { value: 'OTHER', label: 'Other' },
];

export default function ReportModal({ isOpen, onClose, targetType, targetId, title }) {
    const [reason, setReason] = useState('SPAM');
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setDone(false);
        setErrorMsg('');
        setReason('SPAM');
        onClose();
    };

    const handleSubmit = async () => {
        if (sending) return;
        setSending(true);
        setErrorMsg('');
        try {
            await reportsApi.create({
                targetType,
                ...(targetType === 'POST' ? { postId: targetId } : { userId: targetId }),
                reason,
            });
            setDone(true);
        } catch (err) {
            const msg =
                err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.detail ||
                err.response?.data?.user?.[0] ||
                err.response?.data?.post?.[0] ||
                'Failed to send report';
            setErrorMsg(msg);
        } finally {
            setSending(false);
        }
    };

    const modalTitle = title || (targetType === 'POST' ? 'Report post' : 'Report user');
    const description = targetType === 'POST'
        ? 'Why are you reporting this post?'
        : 'Why are you reporting this user?';

    return (
        <div className="post__delete-overlay">
            <div className="post__delete-modal">
                <h2 className="post__delete-modal-title">{modalTitle}</h2>
                {done ? (
                    <p className="post__delete-modal-text">
                        Report sent. Thank you!
                    </p>
                ) : (
                    <>
                        <p className="post__delete-modal-text">{description}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
                            {REPORT_REASONS.map((r) => (
                                <label
                                    key={r.value}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}
                                >
                                    <input
                                        type="radio"
                                        name={`report-reason-${targetType}-${targetId}`}
                                        value={r.value}
                                        checked={reason === r.value}
                                        onChange={() => setReason(r.value)}
                                    />
                                    {r.label}
                                </label>
                            ))}
                        </div>
                        {errorMsg && (
                            <p style={{
                                fontSize: 13,
                                color: 'var(--color-red)',
                                margin: '4px 0 0',
                                lineHeight: 1.4,
                            }}>
                                {errorMsg}
                            </p>
                        )}
                    </>
                )}
                <div className="post__delete-modal-buttons">
                    <button
                        className="post__delete-modal-btn post__delete-modal-btn--cancel"
                        onClick={handleClose}
                    >
                        {done ? 'Close' : 'Cancel'}
                    </button>
                    {!done && (
                        <button
                            className="post__delete-modal-btn post__delete-modal-btn--submit"
                            disabled={sending}
                            onClick={handleSubmit}
                        >
                            Send Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReportsList, updateReportStatus } from '../../../api/adminApi';
import { getAvatarUrl } from '../../../utils/avatar';
import authService from '../../../api/authService';
import logo from '../../../assets/images/logo.svg';
import './AdminReports.scss';

const REPORT_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' },
];

const REASON_LABELS = {
    spam: 'Spam',
    harassment: 'Harassment',
    inappropriate: 'Inappropriate content',
    misinformation: 'Misinformation',
    other: 'Other',
};

export default function AdminReports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    const user = authService.getCurrentUser();

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getReportsList();
            const list = Array.isArray(data) ? data : (data?.results ?? []);
            setReports(list);
        } catch (err) {
            setError(err.response?.status === 403 ? 'Access denied' : 'Failed to load reports');
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const filteredReports = statusFilter
        ? reports.filter((r) => (r.status || '').toLowerCase() === statusFilter)
        : reports;

    useEffect(() => {
        document.body.classList.add('admin-page');
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.classList.remove('admin-page');
            document.body.style.overflow = prev;
        };
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/sign-in');
    };

    const closeSidebar = () => setSidebarOpen(false);

    const topbarDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const isStatusLocked = (report) =>
        report.status === 'resolved' || report.status === 'dismissed';

    const handleStatusChange = async (reportId, newStatus) => {
        setUpdatingId(reportId);
        try {
            await updateReportStatus(reportId, newStatus);
            setReports((prev) =>
                prev.map((r) =>
                    r.id === reportId
                        ? {
                              ...r,
                              status: newStatus,
                              post: r.target_type === 'post' && newStatus === 'resolved' ? null : r.post,
                              user: r.user,
                          }
                        : r
                )
            );
            setSelectedReport((prev) =>
                prev?.id === reportId
                    ? { ...prev, status: newStatus, post: prev.target_type === 'post' && newStatus === 'resolved' ? null : prev.post }
                    : prev
            );
        } catch (err) {
            const msg = err.response?.data?.status?.[0] || err.response?.data?.detail || err.message;
            alert(msg || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusChangeFromModal = (newStatus) => {
        if (!selectedReport || isStatusLocked(selectedReport)) return;
        handleStatusChange(selectedReport.id, newStatus).then(() => setSelectedReport(null));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const targetDisplay = (r) => {
        if (r.target_type === 'post') return r.post ? `Post #${r.post.id}` : '(deleted)';
        if (r.target_type === 'user') return r.user ? `User #${r.user.id}` : '—';
        return '—';
    };

    const reasonDisplay = (reason) => REASON_LABELS[reason] || reason || '—';

    if (error && reports.length === 0) {
        return (
            <div className="admin-dashboard admin-dashboard--error">
                <p>{error}</p>
                <Link to="/feed">Back to Feed</Link>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div
                className={`admin-dashboard__sidebar-overlay ${sidebarOpen ? 'admin-dashboard__sidebar-overlay--open' : ''}`}
                onClick={closeSidebar}
                aria-hidden
            />

            <aside className={`admin-dashboard__sidebar ${sidebarOpen ? 'admin-dashboard__sidebar--open' : ''}`}>
                <div className="admin-dashboard__sidebar-logo">
                    <img src={logo} alt="" className="admin-dashboard__logo-img" width={36} height={34} />
                </div>

                <nav className="admin-dashboard__nav">
                    <div className="admin-dashboard__nav-label">Navigation</div>
                    <Link to="/feed" className="admin-dashboard__nav-item" onClick={closeSidebar}>
                        <span className="admin-dashboard__nav-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </span>
                        Back to Feed
                    </Link>
                    <Link to="/admin" className="admin-dashboard__nav-item" onClick={closeSidebar}>
                        <span className="admin-dashboard__nav-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </span>
                        Dashboard
                    </Link>
                    <Link to="/admin/reports" className="admin-dashboard__nav-item admin-dashboard__nav-item--active" onClick={closeSidebar}>
                        <span className="admin-dashboard__nav-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" y1="22" x2="4" y2="15" />
                            </svg>
                        </span>
                        Reports
                    </Link>
                    <Link to="/admin/users" className="admin-dashboard__nav-item" onClick={closeSidebar}>
                        <span className="admin-dashboard__nav-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </span>
                        Users
                    </Link>
                    <Link to="/admin/organizations" className="admin-dashboard__nav-item" onClick={closeSidebar}>
                        <span className="admin-dashboard__nav-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-4 0v2" />
                            </svg>
                        </span>
                        Organizations
                    </Link>
                </nav>

                <div className="admin-dashboard__sidebar-footer">
                    <div className="admin-dashboard__admin-card">
                        <div className="admin-dashboard__admin-avatar">
                            {user?.avatar ? (
                                <img src={getAvatarUrl(user.avatar)} alt="" />
                            ) : (
                                (user?.email?.[0] || 'A').toUpperCase()
                            )}
                        </div>
                        <div className="admin-dashboard__admin-info">
                            <div className="admin-dashboard__admin-name">{user?.username || user?.nickname || user?.email || 'Admin'}</div>
                            <div className="admin-dashboard__admin-role">Staff</div>
                        </div>
                    </div>
                    <button type="button" className="admin-dashboard__btn-logout" onClick={handleLogout}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-dashboard__main">
                <header className="admin-dashboard__topbar">
                    <div className="admin-dashboard__topbar-left">
                        <button
                            type="button"
                            className="admin-dashboard__mob-menu-btn"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Menu"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <span className="admin-dashboard__topbar-title">Reports</span>
                    </div>
                    <div className="admin-dashboard__topbar-right">
                        <span className="admin-dashboard__topbar-date">{topbarDate}</span>
                    </div>
                </header>

                <div className="admin-dashboard__page">
                    <div className="admin-reports__toolbar">
                        <select
                            className="admin-reports__filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            aria-label="Filter by status"
                        >
                            <option value="">All statuses</option>
                            {REPORT_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <button type="button" className="admin-reports__refresh" onClick={() => fetchReports()}>
                            Refresh
                        </button>
                    </div>

                    {loading && reports.length === 0 ? (
                        <p className="admin-dashboard__loading">Loading…</p>
                    ) : (
                        <div className="admin-dashboard__table-card admin-reports__table-card">
                            <div className="admin-dashboard__table-header">
                                <div className="admin-dashboard__table-title">All reports</div>
                            </div>
                            <div className="admin-dashboard__table-scroll">
                                <table className="admin-dashboard__table">
                                    <thead>
                                        <tr>
                                            <th>Reporter</th>
                                            <th>Type</th>
                                            <th>Target</th>
                                            <th>Reason</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th className="admin-reports__th-actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="admin-dashboard__table-empty">
                                                    {reports.length === 0 ? 'No reports' : 'No reports with selected status'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredReports.map((r) => (
                                                <tr
                                                    key={r.id}
                                                    className="admin-reports__row"
                                                    onClick={() => setSelectedReport(r)}
                                                >
                                                    <td>
                                                        <div className="admin-dashboard__user-row">
                                                            <div className="admin-dashboard__user-avatar-sm">
                                                                {r.reporter?.avatar ? (
                                                                    <img src={getAvatarUrl(r.reporter.avatar)} alt="" />
                                                                ) : (
                                                                    (r.reporter?.email?.[0] || '?').toUpperCase()
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div>@{r.reporter?.username || r.reporter?.email || '—'}</div>
                                                                <div className="admin-dashboard__user-email">ID #{r.reporter?.id ?? '—'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`admin-dashboard__badge admin-dashboard__badge--${r.target_type === 'user' ? 'user' : 'post'}`}>
                                                            {(r.target_type || '').toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td>{targetDisplay(r)}</td>
                                                    <td>{reasonDisplay(r.reason)}</td>
                                                    <td className="admin-dashboard__table-muted">{formatDate(r.created_at)}</td>
                                                    <td>
                                                        <span className={`admin-dashboard__badge admin-dashboard__badge--${(r.status || '').toLowerCase()}`}>
                                                            {(r.status || '').toLowerCase()}
                                                        </span>
                                                    </td>
                                                    <td className="admin-reports__actions" onClick={(e) => e.stopPropagation()}>
                                                        <div className="admin-reports__actions-inner">
                                                        {isStatusLocked(r) ? (
                                                            <span className={`admin-dashboard__badge admin-dashboard__badge--${(r.status || '').toLowerCase()}`}>
                                                                {r.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                                                            </span>
                                                        ) : (
                                                            <div className="admin-reports__btns">
                                                                <button
                                                                    type="button"
                                                                    className="admin-reports__btn admin-reports__btn--resolve"
                                                                    disabled={updatingId === r.id}
                                                                    onClick={() => handleStatusChange(r.id, 'resolved')}
                                                                >
                                                                    {updatingId === r.id ? '…' : 'Resolve'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="admin-reports__btn admin-reports__btn--dismiss"
                                                                    disabled={updatingId === r.id}
                                                                    onClick={() => handleStatusChange(r.id, 'dismissed')}
                                                                >
                                                                    Dismiss
                                                                </button>
                                                            </div>
                                                        )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {selectedReport && (
                <div
                    className="admin-reports__modal-overlay"
                    onClick={() => setSelectedReport(null)}
                    aria-hidden
                >
                    <div
                        className="admin-reports__modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-labelledby="report-modal-title"
                    >
                        <div className="admin-reports__modal-header">
                            <h2 id="report-modal-title" className="admin-reports__modal-title">Report #{selectedReport.id}</h2>
                            <button
                                type="button"
                                className="admin-reports__modal-close"
                                onClick={() => setSelectedReport(null)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="admin-reports__modal-body">
                            <div className="admin-reports__modal-section">
                                <span className="admin-reports__modal-label">Reporter</span>
                                <div className="admin-dashboard__user-row">
                                    <div className="admin-dashboard__user-avatar-sm">
                                        {selectedReport.reporter?.avatar ? (
                                            <img src={getAvatarUrl(selectedReport.reporter.avatar)} alt="" />
                                        ) : (
                                            (selectedReport.reporter?.email?.[0] || '?').toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <div>@{selectedReport.reporter?.username || selectedReport.reporter?.email || '—'}</div>
                                        <div className="admin-dashboard__user-email">ID #{selectedReport.reporter?.id ?? '—'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="admin-reports__modal-section">
                                <span className="admin-reports__modal-label">Reason</span>
                                <div className="admin-reports__modal-value">{reasonDisplay(selectedReport.reason)}</div>
                            </div>
                            <div className="admin-reports__modal-section">
                                <span className="admin-reports__modal-label">Status</span>
                                <span className={`admin-dashboard__badge admin-dashboard__badge--${(selectedReport.status || '').toLowerCase()}`}>
                                    {(selectedReport.status || '').toLowerCase()}
                                </span>
                            </div>
                            <div className="admin-reports__modal-section">
                                <span className="admin-reports__modal-label">
                                    {(selectedReport.target_type || '').toUpperCase()} reported
                                </span>
                                {selectedReport.target_type === 'post' ? (
                                    selectedReport.post ? (
                                        <div className="admin-reports__modal-target">
                                            <div className="admin-reports__modal-post-content">{selectedReport.post.content || '—'}</div>
                                            <div className="admin-dashboard__table-muted">
                                                by @{selectedReport.post.author?.username || selectedReport.post.author?.email || '—'} · Post #{selectedReport.post.id}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="admin-reports__modal-value admin-reports__modal-value--muted">(Post deleted)</div>
                                    )
                                ) : (
                                    selectedReport.user ? (
                                        <div className="admin-reports__modal-target">
                                            <div className="admin-reports__modal-value">
                                                @{selectedReport.user.username || selectedReport.user.nickname || selectedReport.user.email || '—'}
                                            </div>
                                            <div className="admin-dashboard__table-muted">User #{selectedReport.user.id}</div>
                                        </div>
                                    ) : (
                                        <div className="admin-reports__modal-value admin-reports__modal-value--muted">—</div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="admin-reports__modal-footer">
                            <button
                                type="button"
                                className="admin-reports__modal-btn admin-reports__modal-btn--secondary"
                                onClick={() => setSelectedReport(null)}
                            >
                                Close
                            </button>
                            {!isStatusLocked(selectedReport) && (
                                <>
                                    <button
                                        type="button"
                                        className="admin-reports__modal-btn admin-reports__modal-btn--dismiss"
                                        disabled={updatingId === selectedReport.id}
                                        onClick={() => handleStatusChangeFromModal('dismissed')}
                                    >
                                        {updatingId === selectedReport.id ? '…' : 'Dismiss'}
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-reports__modal-btn admin-reports__modal-btn--resolve"
                                        disabled={updatingId === selectedReport.id}
                                        onClick={() => handleStatusChangeFromModal('resolved')}
                                    >
                                        {updatingId === selectedReport.id ? '…' : 'Resolve'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

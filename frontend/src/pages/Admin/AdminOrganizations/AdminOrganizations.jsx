import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminOrganizationsList } from '../../../api/adminApi';
import { getAvatarUrl } from '../../../utils/avatar';
import authService from '../../../api/authService';
import logo from '../../../assets/images/logo.svg';
import './AdminOrganizations.scss';

export default function AdminOrganizations() {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [page, setPage] = useState(1);

    const user = authService.getCurrentUser();

    const fetchOrganizations = useCallback(async (pageNum = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminOrganizationsList({ page: pageNum });
            const list = data?.results ?? [];
            setOrganizations(list);
            setPagination({
                count: data?.count ?? 0,
                next: data?.next ?? null,
                previous: data?.previous ?? null,
            });
        } catch (err) {
            setError(err.response?.status === 403 ? 'Access denied' : 'Failed to load organizations');
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizations(page);
    }, [page, fetchOrganizations]);

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

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const topbarDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    if (error && organizations.length === 0) {
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
                    <Link to="/admin/reports" className="admin-dashboard__nav-item" onClick={closeSidebar}>
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
                    <Link to="/admin/organizations" className="admin-dashboard__nav-item admin-dashboard__nav-item--active" onClick={closeSidebar}>
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
                        <span className="admin-dashboard__topbar-title">Organizations</span>
                    </div>
                    <div className="admin-dashboard__topbar-right">
                        <span className="admin-dashboard__topbar-date">{topbarDate}</span>
                    </div>
                </header>

                <div className="admin-dashboard__page">
                    {loading && organizations.length === 0 ? (
                        <p className="admin-dashboard__loading">Loading…</p>
                    ) : (
                        <div className="admin-dashboard__table-card admin-orgs__table-card">
                            <div className="admin-dashboard__table-header">
                                <div className="admin-dashboard__table-title">All organizations</div>
                            </div>
                            <div className="admin-dashboard__table-scroll">
                                <table className="admin-dashboard__table">
                                    <thead>
                                        <tr>
                                            <th>Organization</th>
                                            <th>Nickname</th>
                                            <th>Owner</th>
                                            <th>Verified</th>
                                            <th>Followers</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organizations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="admin-dashboard__table-empty">No organizations</td>
                                            </tr>
                                        ) : (
                                            organizations.map((org) => (
                                                <tr
                                                    key={org.id}
                                                    className="admin-orgs__row"
                                                    onClick={() => setSelectedOrg(org)}
                                                >
                                                    <td>
                                                        <div className="admin-dashboard__user-row">
                                                            <div className="admin-dashboard__user-avatar-sm">
                                                                {org.avatar ? (
                                                                    <img src={getAvatarUrl(org.avatar)} alt="" />
                                                                ) : (
                                                                    (org.username?.[0] || '?').toUpperCase()
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div>@{org.username || '—'}</div>
                                                                <div className="admin-dashboard__user-email">ID #{org.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{org.nickname || '—'}</td>
                                                    <td>@{org.owner?.username || org.owner?.email || '—'}</td>
                                                    <td>{org.is_verified ? 'Yes' : 'No'}</td>
                                                    <td>{org.followers_count ?? 0}</td>
                                                    <td className="admin-dashboard__table-muted">{formatDate(org.created_at)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {pagination.count > 0 && (
                                <div className="admin-orgs__pagination">
                                    <button
                                        type="button"
                                        className="admin-orgs__page-btn"
                                        disabled={!pagination.previous}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    >
                                        Previous
                                    </button>
                                    <span className="admin-orgs__page-info">
                                        Page {page} of {Math.ceil(pagination.count / 20) || 1}
                                    </span>
                                    <button
                                        type="button"
                                        className="admin-orgs__page-btn"
                                        disabled={!pagination.next}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {selectedOrg && (
                <div
                    className="admin-orgs__modal-overlay"
                    onClick={() => setSelectedOrg(null)}
                    aria-hidden
                >
                    <div
                        className="admin-orgs__modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-labelledby="org-modal-title"
                    >
                        <div className="admin-orgs__modal-header">
                            <h2 id="org-modal-title" className="admin-orgs__modal-title">Organization #{selectedOrg.id}</h2>
                            <button
                                type="button"
                                className="admin-orgs__modal-close"
                                onClick={() => setSelectedOrg(null)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="admin-orgs__modal-body">
                            <div className="admin-orgs__modal-avatar-wrap">
                                <div className="admin-orgs__modal-avatar">
                                    {selectedOrg.avatar ? (
                                        <img src={getAvatarUrl(selectedOrg.avatar)} alt="" />
                                    ) : (
                                        (selectedOrg.username?.[0] || '?').toUpperCase()
                                    )}
                                </div>
                            </div>
                            <div className="admin-orgs__modal-section">
                                <span className="admin-orgs__modal-label">Username</span>
                                <div className="admin-orgs__modal-value">@{selectedOrg.username || '—'}</div>
                            </div>
                            <div className="admin-orgs__modal-section">
                                <span className="admin-orgs__modal-label">Nickname</span>
                                <div className="admin-orgs__modal-value">{selectedOrg.nickname || '—'}</div>
                            </div>
                            <div className="admin-orgs__modal-section">
                                <span className="admin-orgs__modal-label">Owner</span>
                                <div className="admin-orgs__modal-value">
                                    @{selectedOrg.owner?.username || '—'} ({selectedOrg.owner?.email || '—'})
                                </div>
                            </div>
                            <div className="admin-orgs__modal-section">
                                <span className="admin-orgs__modal-label">Verified</span>
                                <div className="admin-orgs__modal-value">{selectedOrg.is_verified ? 'Yes' : 'No'}</div>
                            </div>
                            <div className="admin-orgs__modal-section">
                                <span className="admin-orgs__modal-label">Followers</span>
                                <div className="admin-orgs__modal-value">{selectedOrg.followers_count ?? 0}</div>
                            </div>
                            <div className="admin-orgs__modal-section">
                                <span className="admin-orgs__modal-label">Created</span>
                                <div className="admin-orgs__modal-value">{formatDate(selectedOrg.created_at)}</div>
                            </div>
                        </div>
                        <div className="admin-orgs__modal-footer">
                            <button
                                type="button"
                                className="admin-orgs__modal-btn admin-orgs__modal-btn--secondary"
                                onClick={() => setSelectedOrg(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

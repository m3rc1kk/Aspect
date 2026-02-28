import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getAdminDashboard } from '../../../api/adminApi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);
import { getAvatarUrl } from '../../../utils/avatar';
import authService from '../../../api/authService';
import logo from '../../../assets/images/logo.svg';
import './AdminDashboard.scss';

const CHART_PERIODS = [7, 30, 90];

const CHART_FONT = '"Gotham", sans-serif';

const createLineGradient = (ctx, chartArea, colors) => {
    if (!chartArea) return colors[0];
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    return gradient;
};

const REG_GRADIENT = ['rgba(59, 130, 246, 0.5)', 'rgba(96, 165, 250, 0.2)', 'rgba(147, 197, 253, 0.05)'];
const ACTIVITY_GRADIENT = ['rgba(16, 185, 129, 0.9)', 'rgba(52, 211, 153, 0.6)', 'rgba(110, 231, 183, 0.4)'];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartDaysReg, setChartDaysReg] = useState(30);
    const [chartDaysActivity, setChartDaysActivity] = useState(30);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = authService.getCurrentUser();

    const fetchDashboard = useCallback(async (days = 30) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAdminDashboard(days);
            setData(res);
        } catch (err) {
            setError(err.response?.status === 403 ? 'Access denied' : 'Failed to load dashboard');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const days = Math.max(chartDaysReg, chartDaysActivity);
        fetchDashboard(days);
    }, [chartDaysReg, chartDaysActivity, fetchDashboard]);

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

    if (error && !data) {
        return (
            <div className="admin-dashboard admin-dashboard--error">
                <p>{error}</p>
                <Link to="/feed">Back to Feed</Link>
            </div>
        );
    }

    const m = data?.metrics || {};
    const charts = data?.charts || {};
    const regChart = charts.registrations_by_day || { labels: [], data: [] };
    const actChart = charts.activity_by_day || { labels: [], posts: [] };
    const latestReports = data?.latest_reports || [];
    const latestUsers = data?.latest_users || [];

    const formatChartDate = (str) => {
        if (!str || typeof str !== 'string') return str;
        const [d, m] = str.split('.');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(m, 10) - 1] || ''} ${d}`;
    };

    const regLabels = (regChart.labels || []).slice(-chartDaysReg).map(formatChartDate);
    const regValues = (regChart.data || []).slice(-chartDaysReg).map((v) => v ?? 0);

    const activityLabels = (actChart.labels || []).slice(-chartDaysActivity).map(formatChartDate);
    const activityValues = (actChart.posts || []).slice(-chartDaysActivity).map((v) => v ?? 0);

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'var(--color-light)',
                    titleFont: { family: CHART_FONT, size: 11, weight: '600' },
                    bodyFont: { family: CHART_FONT, size: 13, weight: '700' },
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        title: (items) => items[0]?.label ?? '',
                        label: (ctx) => `${ctx.raw} ${ctx.dataset.label}`,
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        font: { family: CHART_FONT, size: 11, weight: '500' },
                        color: '#94A3B8',
                        maxRotation: 0,
                        maxTicksLimit: 8,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#E2E8F0', drawTicks: false },
                    border: { display: false },
                    ticks: {
                        font: { family: CHART_FONT, size: 11, weight: '500' },
                        color: '#94A3B8',
                        padding: 8,
                    },
                },
            },
        }),
        []
    );

    const regChartConfig = useMemo(
        () => ({
            labels: regLabels,
            datasets: [
                {
                    label: 'registrations',
                    data: regValues,
                    fill: true,
                    tension: 0.35,
                    borderColor: '#2563EB',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#2563EB',
                    backgroundColor: (ctx) => {
                        const chart = ctx.chart;
                        const { ctx: context, chartArea } = chart;
                        return createLineGradient(context, chartArea, REG_GRADIENT);
                    },
                },
            ],
        }),
        [regLabels, regValues]
    );

    const activityChartConfig = useMemo(
        () => ({
            labels: activityLabels,
            datasets: [
                {
                    label: 'posts',
                    data: activityValues,
                    backgroundColor: (ctx) => {
                        const chart = ctx.chart;
                        const { ctx: context, chartArea } = chart;
                        return createLineGradient(context, chartArea, ACTIVITY_GRADIENT);
                    },
                    borderRadius: 6,
                    barThickness: 28,
                    maxBarThickness: 40,
                },
            ],
        }),
        [activityLabels, activityValues]
    );

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
                    <Link to="/admin" className="admin-dashboard__nav-item admin-dashboard__nav-item--active">
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
                        <span className="admin-dashboard__topbar-title">Dashboard</span>
                    </div>
                    <div className="admin-dashboard__topbar-right">
                        <span className="admin-dashboard__topbar-date">{topbarDate}</span>
                    </div>
                </header>

                <div className="admin-dashboard__page">
                    {loading && !data ? (
                        <p className="admin-dashboard__loading">Loading…</p>
                    ) : (
                        <>
                            <div className="admin-dashboard__metrics-grid">
                                <div className="admin-dashboard__metric-card admin-dashboard__metric-card--blue">
                                    <div className="admin-dashboard__metric-header">
                                        <div className="admin-dashboard__metric-icon-wrap">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__metric-value">{m.users_total ?? 0}</div>
                                    <div className="admin-dashboard__metric-label">Users</div>
                                    <div className="admin-dashboard__metric-sub">+{m.users_today ?? 0} today</div>
                                </div>

                                <div className="admin-dashboard__metric-card admin-dashboard__metric-card--green">
                                    <div className="admin-dashboard__metric-header">
                                        <div className="admin-dashboard__metric-icon-wrap">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__metric-value">{m.posts_total ?? 0}</div>
                                    <div className="admin-dashboard__metric-label">Posts</div>
                                    <div className="admin-dashboard__metric-sub">+{m.posts_today ?? 0} today</div>
                                </div>

                                <div className="admin-dashboard__metric-card admin-dashboard__metric-card--orange">
                                    <div className="admin-dashboard__metric-header">
                                        <div className="admin-dashboard__metric-icon-wrap">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                                <line x1="4" y1="22" x2="4" y2="15" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__metric-value">{m.reports_pending ?? 0}</div>
                                    <div className="admin-dashboard__metric-label">Reports (pending)</div>
                                    <div className="admin-dashboard__metric-sub">Awaiting review</div>
                                </div>

                                <div className="admin-dashboard__metric-card admin-dashboard__metric-card--purple">
                                    <div className="admin-dashboard__metric-header">
                                        <div className="admin-dashboard__metric-icon-wrap">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                                <path d="M16 7V5a2 2 0 0 0-4 0v2" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__metric-value">{m.organizations_total ?? 0}</div>
                                    <div className="admin-dashboard__metric-label">Organizations</div>
                                    <div className="admin-dashboard__metric-sub">{m.organizations_verified ?? 0} verified</div>
                                </div>
                            </div>

                            <div className="admin-dashboard__charts-grid">
                                <div className="admin-dashboard__chart-card">
                                    <div className="admin-dashboard__chart-header">
                                        <div>
                                            <div className="admin-dashboard__chart-title">Registrations by day</div>
                                            <div className="admin-dashboard__chart-subtitle">Last {chartDaysReg} days</div>
                                        </div>
                                        <div className="admin-dashboard__chart-period">
                                            {CHART_PERIODS.map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    className={`admin-dashboard__period-btn ${chartDaysReg === d ? 'admin-dashboard__period-btn--active' : ''}`}
                                                    onClick={() => setChartDaysReg(d)}
                                                >
                                                    {d}d
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__chart-wrap">
                                        <Line data={regChartConfig} options={chartOptions} />
                                    </div>
                                </div>

                                <div className="admin-dashboard__chart-card">
                                    <div className="admin-dashboard__chart-header">
                                        <div>
                                            <div className="admin-dashboard__chart-title">Platform activity</div>
                                            <div className="admin-dashboard__chart-subtitle">Posts, {chartDaysActivity} days</div>
                                        </div>
                                        <div className="admin-dashboard__chart-period">
                                            {CHART_PERIODS.map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    className={`admin-dashboard__period-btn ${chartDaysActivity === d ? 'admin-dashboard__period-btn--active' : ''}`}
                                                    onClick={() => setChartDaysActivity(d)}
                                                >
                                                    {d}d
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="admin-dashboard__chart-wrap">
                                        <Bar data={activityChartConfig} options={chartOptions} />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-dashboard__tables-grid">
                                <div className="admin-dashboard__table-card">
                                    <div className="admin-dashboard__table-header">
                                        <div className="admin-dashboard__table-title">Latest reports</div>
                                    </div>
                                    <div className="admin-dashboard__table-scroll">
                                    <table className="admin-dashboard__table">
                                        <thead>
                                            <tr>
                                                <th>Reporter</th>
                                                <th>Type</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {latestReports.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="admin-dashboard__table-empty">No reports</td>
                                                </tr>
                                            ) : (
                                                latestReports.map((r) => (
                                                    <tr key={r.id}>
                                                        <td>@{r.reporter_username}</td>
                                                        <td>
                                                            <span className={`admin-dashboard__badge admin-dashboard__badge--${r.target_type === 'USER' ? 'user' : 'post'}`}>
                                                                {r.target_type}
                                                            </span>
                                                        </td>
                                                        <td>{r.reason}</td>
                                                        <td>
                                                            <span className={`admin-dashboard__badge admin-dashboard__badge--${r.status?.toLowerCase()}`}>
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>

                                <div className="admin-dashboard__table-card">
                                    <div className="admin-dashboard__table-header">
                                        <div className="admin-dashboard__table-title">Latest users</div>
                                    </div>
                                    <div className="admin-dashboard__table-scroll">
                                    <table className="admin-dashboard__table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Nickname</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {latestUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="admin-dashboard__table-empty">No users</td>
                                                </tr>
                                            ) : (
                                                latestUsers.map((u) => (
                                                    <tr key={u.id}>
                                                        <td>
                                                            <div className="admin-dashboard__user-row">
                                                                <div className="admin-dashboard__user-avatar-sm">
                                                                    {u.avatar ? (
                                                                        <img src={u.avatar} alt="" />
                                                                    ) : (
                                                                        (u.email?.[0] || '?').toUpperCase()
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div>{u.email}</div>
                                                                    <div className="admin-dashboard__user-email">ID #{u.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>@{u.username || u.nickname || '—'}</td>
                                                        <td className="admin-dashboard__table-muted">{u.date_joined}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

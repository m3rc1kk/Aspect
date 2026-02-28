import axiosInstance from './axiosConfig';

/**
 * Fetch admin dashboard data (metrics, charts, latest reports, latest users).
 * Requires admin user (IsAdminUser on backend).
 * @param {number} chartDays - 7, 30, or 90
 * @returns {Promise<{ metrics, charts, latest_reports, latest_users }>}
 */
export async function getAdminDashboard(chartDays = 30) {
    const days = [7, 30, 90].includes(chartDays) ? chartDays : 30;
    const { data } = await axiosInstance.get('admin-panel/dashboard/', {
        params: { chart_days: days },
    });
    return data;
}

/**
 * Fetch all reports (admin). Optional filter: status, reporter.
 * @returns {Promise<Array>}
 */
export async function getReportsList(params = {}) {
    const { data } = await axiosInstance.get('reports/', { params });
    return data;
}

/**
 * Update report status (admin). Only pending can be changed to resolved/dismissed.
 * @param {number} reportId
 * @param {string} status - 'resolved' | 'dismissed' | 'pending' | 'reviewed'
 * @returns {Promise<Object>}
 */
export async function updateReportStatus(reportId, status) {
    const { data } = await axiosInstance.put(`reports/${reportId}/`, { status });
    return data;
}

/**
 * Fetch paginated users list (admin).
 * @param {object} params - { page }
 * @returns {Promise<{ count, results, next, previous }>}
 */
export async function getAdminUsersList(params = {}) {
    const { data } = await axiosInstance.get('admin-panel/users/', { params });
    return data;
}

/**
 * Fetch paginated organizations list (admin).
 * @param {object} params - { page }
 * @returns {Promise<{ count, results, next, previous }>}
 */
export async function getAdminOrganizationsList(params = {}) {
    const { data } = await axiosInstance.get('admin-panel/organizations/', { params });
    return data;
}

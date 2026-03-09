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

export async function updateAdminUserActive(userId, isActive) {
    const { data } = await axiosInstance.patch(`admin-panel/users/${userId}/`, { is_active: isActive });
    return data;
}

/**
 * Fetch chats of a user (admin). Returns list of chats with other_participant and last_message.
 * @param {number} userId
 * @returns {Promise<Array<{ id, other_participant, last_message, created_at, updated_at }>>}
 */
export async function getAdminUserChats(userId) {
    const { data } = await axiosInstance.get(`admin-panel/users/${userId}/chats/`);
    return data;
}

/**
 * Fetch messages of a specific chat for a user (admin).
 * @param {number} userId
 * @param {number} chatId
 * @returns {Promise<Array>}
 */
export async function getAdminUserChatMessages(userId, chatId) {
    const { data } = await axiosInstance.get(`admin-panel/users/${userId}/chats/${chatId}/messages/`);
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

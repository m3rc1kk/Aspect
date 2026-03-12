import axiosInstance from './axiosConfig';

export async function getAdminDashboard(chartDays = 30) {
    const days = [7, 30, 90].includes(chartDays) ? chartDays : 30;
    const { data } = await axiosInstance.get('admin-panel/dashboard/', {
        params: { chart_days: days },
    });
    return data;
}

export async function getReportsList(params = {}) {
    const { data } = await axiosInstance.get('reports/', { params });
    return data;
}

export async function updateReportStatus(reportId, status) {
    const { data } = await axiosInstance.put(`reports/${reportId}/`, { status });
    return data;
}

export async function getAdminUsersList(params = {}) {
    const { data } = await axiosInstance.get('admin-panel/users/', { params });
    return data;
}

export async function updateAdminUserActive(userId, isActive) {
    const { data } = await axiosInstance.patch(`admin-panel/users/${userId}/`, { is_active: isActive });
    return data;
}

export async function getAdminUserChats(userId) {
    const { data } = await axiosInstance.get(`admin-panel/users/${userId}/chats/`);
    return data;
}

export async function getAdminUserChatMessages(userId, chatId) {
    const { data } = await axiosInstance.get(`admin-panel/users/${userId}/chats/${chatId}/messages/`);
    return data;
}

export async function getAdminOrganizationsList(params = {}) {
    const { data } = await axiosInstance.get('admin-panel/organizations/', { params });
    return data;
}

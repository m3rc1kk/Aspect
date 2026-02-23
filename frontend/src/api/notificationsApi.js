import axiosInstance from './axiosConfig';

export const notificationsApi = {
    getList: async (params = {}) => {
        const response = await axiosInstance.get('/notifications/', { params });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await axiosInstance.get('/notifications/unread-count/');
        return response.data.unread_count ?? 0;
    },

    markRead: async (id) => {
        const response = await axiosInstance.post(`/notifications/${id}/read/`);
        return response.data;
    },

    markAllRead: async () => {
        await axiosInstance.post('/notifications/read-all/');
    },
};

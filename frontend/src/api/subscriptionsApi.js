import axiosInstance from './axiosConfig';

export const subscriptionsApi = {
    subscribe: async (userId) => {
        try {
            const response = await axiosInstance.post('/subscriptions/', {
                following: userId,
            });
            return response.data;
        } catch (error) {
            console.error('Error subscribing:', error.response?.data || error.message);
            throw error;
        }
    },

    unsubscribe: async (userId) => {
        try {
            await axiosInstance.delete(`/subscriptions/${userId}/`);
        } catch (error) {
            console.error('Error unsubscribing:', error.response?.data || error.message);
            throw error;
        }
    },
};

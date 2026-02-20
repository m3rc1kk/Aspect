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

    subscribeToOrganization: async (orgId) => {
        try {
            const response = await axiosInstance.post('/org-subscriptions/', {
                following: orgId,
            });
            return response.data;
        } catch (error) {
            console.error('Error subscribing to organization:', error.response?.data || error.message);
            throw error;
        }
    },

    unsubscribeFromOrganization: async (orgId) => {
        try {
            await axiosInstance.delete(`/org-subscriptions/${orgId}/`);
        } catch (error) {
            console.error('Error unsubscribing from organization:', error.response?.data || error.message);
            throw error;
        }
    },
};

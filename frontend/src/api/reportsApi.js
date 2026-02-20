import axiosInstance from './axiosConfig';

export const reportsApi = {
    create: async ({ targetType, postId, userId, reason }) => {
        try {
            const payload = {
                target_type: targetType.toLowerCase(),
                reason: (reason || 'spam').toLowerCase(),
            };
            if (targetType.toLowerCase() === 'post' && postId) payload.post = postId;
            if (targetType.toLowerCase() === 'user' && userId) payload.user = userId;

            const response = await axiosInstance.post('/reports/', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating report:', error.response?.data || error.message);
            throw error;
        }
    },
};

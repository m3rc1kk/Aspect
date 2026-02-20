import axiosInstance from './axiosConfig';

export const searchApi = {
    search: async (query) => {
        try {
            const response = await axiosInstance.get('/search/', {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching:', error.response?.data || error.message);
            throw error;
        }
    },
};

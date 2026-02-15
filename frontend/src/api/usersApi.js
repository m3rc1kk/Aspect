import axiosInstance from './axiosConfig';

export const usersApi = {
    getCurrentUser: async () => {
        try {
            const response = await axiosInstance.get('/profile/');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error.response?.data || error.message);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await axiosInstance.get(`/profile/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error.response?.data || error.message);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const formData = new FormData();
            
            if (userData.username) formData.append('username', userData.username);
            if (userData.nickname) formData.append('nickname', userData.nickname);
            if (userData.avatar instanceof File) formData.append('avatar', userData.avatar);

            const response = await axiosInstance.patch('/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            throw error;
        }
    },
};

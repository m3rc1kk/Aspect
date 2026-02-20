import axiosInstance from './axiosConfig';

export const usersApi = {
    getAll: async () => {
        try {
            const response = await axiosInstance.get('/users/');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
            throw error;
        }
    },

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

            if (userData.avatar) {
                if (typeof userData.avatar === 'string' && userData.avatar.startsWith('data:')) {
                    const arr = userData.avatar.split(',');
                    const mime = arr[0].match(/:(.*?);/)[1];
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) u8arr[n] = bstr.charCodeAt(n);
                    formData.append('avatar', new Blob([u8arr], { type: mime }), 'avatar.jpg');
                } else if (userData.avatar instanceof File) {
                    formData.append('avatar', userData.avatar);
                }
            }

            const response = await axiosInstance.patch('/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            throw error;
        }
    },
};

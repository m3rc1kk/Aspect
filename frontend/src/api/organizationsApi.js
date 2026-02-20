import axiosInstance from './axiosConfig';

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}

export const organizationsApi = {
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/organizations/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching organization:', error.response?.data || error.message);
            throw error;
        }
    },

    getMyOrganizations: async () => {
        try {
            const response = await axiosInstance.get('/organizations/my/');
            return response.data;
        } catch (error) {
            console.error('Error fetching organizations:', error.response?.data || error.message);
            throw error;
        }
    },

    getByOwner: async (ownerId) => {
        try {
            const response = await axiosInstance.get('/organizations/', {
                params: { owner: ownerId },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching organizations:', error.response?.data || error.message);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('nickname', data.nickname);

            if (data.avatar) {
                if (typeof data.avatar === 'string' && data.avatar.startsWith('data:')) {
                    formData.append('avatar', dataURLtoBlob(data.avatar), 'avatar.jpg');
                } else if (data.avatar instanceof File) {
                    formData.append('avatar', data.avatar);
                }
            }

            const response = await axiosInstance.post('/organizations/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating organization:', error.response?.data || error.message);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const formData = new FormData();
            if (data.username) formData.append('username', data.username);
            if (data.nickname) formData.append('nickname', data.nickname);

            if (data.avatar) {
                if (typeof data.avatar === 'string' && data.avatar.startsWith('data:')) {
                    formData.append('avatar', dataURLtoBlob(data.avatar), 'avatar.jpg');
                } else if (data.avatar instanceof File) {
                    formData.append('avatar', data.avatar);
                }
            }

            const response = await axiosInstance.patch(`/organizations/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating organization:', error.response?.data || error.message);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axiosInstance.delete(`/organizations/${id}/`);
        } catch (error) {
            console.error('Error deleting organization:', error.response?.data || error.message);
            throw error;
        }
    },
};

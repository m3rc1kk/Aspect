import axiosInstance from './axiosConfig';

export const likesApi = {
    toggleLike: async (postId) => {
        try {
            const response = await axiosInstance.post('/likes/', {
                post: postId
            });
            return { liked: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 409) {
                try {
                    await axiosInstance.delete(`/likes/${postId}/`);
                    return { liked: false };
                } catch (deleteError) {
                    console.error('Error unliking post:', deleteError.response?.data || deleteError.message);
                    throw deleteError;
                }
            }
            console.error('Error toggling like:', error.response?.data || error.message);
            throw error;
        }
    },

    getLikedPosts: async () => {
        try {
            const response = await axiosInstance.get('/likes/');
            return response.data;
        } catch (error) {
            console.error('Error fetching liked posts:', error.response?.data || error.message);
            throw error;
        }
    },

    getUsersWhoLiked: async (postId) => {
        try {
            const response = await axiosInstance.get(`/likes/post/${postId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users who liked:', error.response?.data || error.message);
            throw error;
        }
    },
};

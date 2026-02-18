import axiosInstance from './axiosConfig';

export const commentsApi = {
    getComments: async (postId) => {
        try {
            const response = await axiosInstance.get('/comments/', {
                params: { post: postId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error.response?.data || error.message);
            throw error;
        }
    },

    getReplies: async (commentId) => {
        try {
            const response = await axiosInstance.get(`/comments/${commentId}/replies/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching replies:', error.response?.data || error.message);
            throw error;
        }
    },

    createComment: async (postId, content, parentId = null) => {
        try {
            const data = { post: postId, content };
            if (parentId) data.parent = parentId;
            const response = await axiosInstance.post('/comments/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteComment: async (commentId) => {
        try {
            const response = await axiosInstance.delete(`/comments/${commentId}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error.response?.data || error.message);
            throw error;
        }
    },
};

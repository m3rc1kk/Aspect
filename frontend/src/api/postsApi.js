import axiosInstance from './axiosConfig';

export const postsApi = {
    getFeed: async (cursor = null, pageSize = 20) => {
        try {
            const params = { page_size: pageSize };
            if (cursor) {
                const value = typeof cursor === 'string' && cursor.startsWith('http')
                    ? new URL(cursor).searchParams.get('cursor')
                    : cursor;
                if (value) params.cursor = value;
            }
            const response = await axiosInstance.get('/feed/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching feed:', error.response?.data || error.message);
            throw error;
        }
    },

    getPosts: async (cursor = null, params = {}) => {
        try {
            const query = { ...params };
            if (cursor) {
                const value = typeof cursor === 'string' && cursor.startsWith('http')
                    ? new URL(cursor).searchParams.get('cursor')
                    : cursor;
                if (value) query.cursor = value;
            }
            const response = await axiosInstance.get('/posts/', { params: query });
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error.response?.data || error.message);
            throw error;
        }
    },

    getPost: async (id) => {
        try {
            const response = await axiosInstance.get(`/posts/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post:', error.response?.data || error.message);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const formData = new FormData();
            formData.append('content', postData.content);

            if (postData.images && postData.images.length > 0) {
                postData.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            if (postData.organizationId) {
                formData.append('organization', postData.organizationId);
            }

            const response = await axiosInstance.post('/posts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error.response?.data || error.message);
            throw error;
        }
    },

    deletePost: async (id) => {
        try {
            const response = await axiosInstance.delete(`/posts/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting post:', error.response?.data || error.message);
            throw error;
        }
    },
};

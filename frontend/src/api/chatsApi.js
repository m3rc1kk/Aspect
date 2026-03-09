import axiosInstance from './axiosConfig';

export const chatsApi = {
    getChats: async () => {
        const response = await axiosInstance.get('/chats/');
        return response.data;
    },

    getChat: async (chatId) => {
        const response = await axiosInstance.get(`/chats/${chatId}/`);
        return response.data;
    },

    createChat: async (participantId) => {
        const response = await axiosInstance.post('/chats/', { participant_id: participantId });
        return response.data;
    },

    getMessages: async (chatId, page = 1) => {
        const response = await axiosInstance.get(`/chats/${chatId}/messages/`, {
            params: { page, page_size: 50 },
        });
        return response.data;
    },

    sendMessage: async (chatId, text) => {
        const response = await axiosInstance.post(`/chats/${chatId}/messages/`, { text });
        return response.data;
    },
};

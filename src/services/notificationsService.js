import api from './api';

const notificationsAPI = {
    getAll: async () => {
        const response = await api.get('/api/notifications/');
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.post(`/api/notifications/${id}/mark_read/`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.post('/api/notifications/mark_all_read/');
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/api/notifications/${id}/`);
    },

    clearAll: async () => {
        const response = await api.delete('/api/notifications/clear_all/');
        return response.data;
    }
};

export default notificationsAPI;

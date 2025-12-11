import api from './api';

const dashboardService = {
    getStats: async () => {
        const response = await api.get('/api/dashboard/stats/');
        return response.data;
    },

    getAnnouncements: async () => {
        const response = await api.get('/api/dashboard/announcements/');
        return response.data;
    },

    createAnnouncement: async (announcementData) => {
        const response = await api.post('/api/dashboard/announcements/', announcementData);
        return response.data;
    },

    updateAnnouncement: async (id, announcementData) => {
        const response = await api.put(`/api/dashboard/announcements/${id}/`, announcementData);
        return response.data;
    },

    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/api/dashboard/announcements/${id}/`);
        return response.data;
    }
};

export default dashboardService;

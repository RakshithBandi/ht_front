import api from './api';

const sponsorsAPI = {
    getAll: async () => {
        const response = await api.get('/api/sponsors/');
        return response.data;
    },

    create: async (sponsorData) => {
        const response = await api.post('/api/sponsors/', sponsorData);
        return response.data;
    },

    update: async (id, sponsorData) => {
        const response = await api.put(`/api/sponsors/${id}/`, sponsorData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/sponsors/${id}/`);
        return response.data;
    }
};

export default sponsorsAPI;

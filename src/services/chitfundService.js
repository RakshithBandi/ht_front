import api from './api';

const chitfundAPI = {
    getAll: async () => {
        const response = await api.get('/api/chitfund/');
        return response.data;
    },

    create: async (chitfundData) => {
        const response = await api.post('/api/chitfund/', chitfundData);
        return response.data;
    },

    update: async (id, chitfundData) => {
        const response = await api.put(`/api/chitfund/${id}/`, chitfundData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/chitfund/${id}/`);
        return response.data;
    }
};

export default chitfundAPI;

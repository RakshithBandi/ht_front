import api from './api';

const memoriesAPI = {
    getAll: async () => {
        const response = await api.get('/api/memories/');
        return response.data;
    },

    create: async (memoryData) => {
        const config = {};
        if (memoryData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.post('/api/memories/', memoryData, config);
        return response.data;
    },

    update: async (id, memoryData) => {
        const response = await api.put(`/api/memories/${id}/`, memoryData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/memories/${id}/`);
        return response.data;
    }
};

export default memoriesAPI;

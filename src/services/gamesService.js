import api from './api';

const gamesAPI = {
    getAll: async () => {
        const response = await api.get('/api/games/');
        return response.data;
    },

    create: async (gameData) => {
        const response = await api.post('/api/games/', gameData);
        return response.data;
    },

    update: async (id, gameData) => {
        const response = await api.put(`/api/games/${id}/`, gameData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/games/${id}/`);
        return response.data;
    }
};

export default gamesAPI;

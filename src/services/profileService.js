import api from './api';

const profileAPI = {
    getProfile: async () => {
        const response = await api.get('/api/profile/me/');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/api/profile/me/', profileData);
        return response.data;
    }
};

export default profileAPI;

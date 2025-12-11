import api from './api';

const membersAPI = {
    permanent: {
        getAll: async () => {
            const response = await api.get('/api/members/permanent/');
            return response.data;
        },
        create: async (memberData) => {
            const response = await api.post('/api/members/permanent/', memberData);
            return response.data;
        },
        update: async (id, memberData) => {
            const response = await api.put(`/api/members/permanent/${id}/`, memberData);
            return response.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/api/members/permanent/${id}/`);
            return response.data;
        }
    },

    temporary: {
        getAll: async () => {
            const response = await api.get('/api/members/temporary/');
            return response.data;
        },
        create: async (memberData) => {
            const response = await api.post('/api/members/temporary/', memberData);
            return response.data;
        },
        update: async (id, memberData) => {
            const response = await api.put(`/api/members/temporary/${id}/`, memberData);
            return response.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/api/members/temporary/${id}/`);
            return response.data;
        }
    },

    junior: {
        getAll: async () => {
            const response = await api.get('/api/members/junior/');
            return response.data;
        },
        create: async (memberData) => {
            const response = await api.post('/api/members/junior/', memberData);
            return response.data;
        },
        update: async (id, memberData) => {
            const response = await api.put(`/api/members/junior/${id}/`, memberData);
            return response.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/api/members/junior/${id}/`);
            return response.data;
        }
    }
};

export default membersAPI;

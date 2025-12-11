import api from './api';

const expenditureAPI = {
    // Get all expenditures
    getAll: async () => {
        try {
            const response = await api.get('/api/expenditure/');
            return response.data;
        } catch (error) {
            console.error('Error fetching expenditures:', error);
            throw error;
        }
    },

    // Get single expenditure by ID
    getById: async (id) => {
        try {
            const response = await api.get(`/api/expenditure/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching expenditure:', error);
            throw error;
        }
    },

    // Create new expenditure
    create: async (expenditureData) => {
        try {
            const response = await api.post('/api/expenditure/', expenditureData);
            return response.data;
        } catch (error) {
            console.error('Error creating expenditure:', error);
            throw error;
        }
    },

    // Update expenditure
    update: async (id, expenditureData) => {
        try {
            const response = await api.put(`/api/expenditure/${id}/`, expenditureData);
            return response.data;
        } catch (error) {
            console.error('Error updating expenditure:', error);
            throw error;
        }
    },

    // Delete expenditure
    delete: async (id) => {
        try {
            await api.delete(`/api/expenditure/${id}/`);
            return true;
        } catch (error) {
            console.error('Error deleting expenditure:', error);
            throw error;
        }
    },
};

export default expenditureAPI;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const expenditureAPI = {
    // Get all expenditures
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/expenditure/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching expenditures:', error);
            throw error;
        }
    },

    // Get single expenditure by ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/expenditure/${id}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching expenditure:', error);
            throw error;
        }
    },

    // Create new expenditure
    create: async (expenditureData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/expenditure/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenditureData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating expenditure:', error);
            throw error;
        }
    },

    // Update expenditure
    update: async (id, expenditureData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/expenditure/${id}/`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenditureData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating expenditure:', error);
            throw error;
        }
    },

    // Delete expenditure
    delete: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/expenditure/${id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting expenditure:', error);
            throw error;
        }
    },
};

export default expenditureAPI;

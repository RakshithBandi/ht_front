const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

const chitfundAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/chitfund/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch chitfund data');
        return response.json();
    },

    create: async (chitfundData) => {
        const response = await fetch(`${API_BASE_URL}/chitfund/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(chitfundData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create chitfund entry: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    update: async (id, chitfundData) => {
        const response = await fetch(`${API_BASE_URL}/chitfund/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(chitfundData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update chitfund entry: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/chitfund/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to delete chitfund entry');
    }
};

export default chitfundAPI;

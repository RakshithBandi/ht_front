const API_BASE_URL = 'http://localhost:8000/api';

const memoriesAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/memories/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch memories');
        return response.json();
    },

    create: async (memoryData) => {
        const response = await fetch(`${API_BASE_URL}/memories/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(memoryData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create memory: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    update: async (id, memoryData) => {
        const response = await fetch(`${API_BASE_URL}/memories/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(memoryData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update memory: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/memories/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to delete memory');
    }
};

export default memoriesAPI;

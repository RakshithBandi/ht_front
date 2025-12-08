const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

const sponsorsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/sponsors/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch sponsors');
        return response.json();
    },

    create: async (sponsorData) => {
        const response = await fetch(`${API_URL}/sponsors/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(sponsorData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create sponsor: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    update: async (id, sponsorData) => {
        const response = await fetch(`${API_URL}/sponsors/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(sponsorData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update sponsor: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/sponsors/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to delete sponsor');
    }
};

export default sponsorsAPI;

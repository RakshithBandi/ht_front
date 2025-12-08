const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

const gamesAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/games/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch games');
        return response.json();
    },

    create: async (gameData) => {
        const response = await fetch(`${API_BASE_URL}/games/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(gameData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create game: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    update: async (id, gameData) => {
        const response = await fetch(`${API_BASE_URL}/games/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(gameData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update game: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/games/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to delete game');
    }
};

export default gamesAPI;

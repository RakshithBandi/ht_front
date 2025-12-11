const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api/dashboard`;

const dashboardService = {
    getStats: async () => {
        const response = await fetch(`${API_URL}/stats/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return response.json();
    },

    getAnnouncements: async () => {
        const response = await fetch(`${API_URL}/announcements/`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch announcements');
        return response.json();
    },

    createAnnouncement: async (announcementData) => {
        const response = await fetch(`${API_URL}/announcements/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(announcementData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create announcement: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    updateAnnouncement: async (id, announcementData) => {
        const response = await fetch(`${API_URL}/announcements/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(announcementData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update announcement: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    deleteAnnouncement: async (id) => {
        const response = await fetch(`${API_URL}/announcements/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to delete announcement');
    }
};

export default dashboardService;

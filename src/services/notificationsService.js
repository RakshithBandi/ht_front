const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api/notifications`;

const notificationsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    markAsRead: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}/mark_read/`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    markAllAsRead: async () => {
        const response = await fetch(`${API_BASE_URL}/mark_all_read/`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to mark all as read: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete notification: ${response.status} ${response.statusText} - ${errorText}`);
        }
    },

    clearAll: async () => {
        const response = await fetch(`${API_BASE_URL}/clear_all/`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to clear all notifications: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    }
};

export default notificationsAPI;

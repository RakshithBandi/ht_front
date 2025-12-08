const API_BASE_URL = 'http://localhost:8000/api/profile';

const profileAPI = {
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/me/`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_BASE_URL}/me/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(profileData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update profile: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.json();
    }
};

export default profileAPI;

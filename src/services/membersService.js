const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

const membersAPI = {
    permanent: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/members/permanent/`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch permanent members');
            return response.json();
        },
        create: async (memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/permanent/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create permanent member: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        },
        update: async (id, memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/permanent/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update permanent member: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/members/permanent/${id}/`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to delete permanent member');
        }
    },

    temporary: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/members/temporary/`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch temporary members');
            return response.json();
        },
        create: async (memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/temporary/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create temporary member: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        },
        update: async (id, memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/temporary/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update temporary member: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/members/temporary/${id}/`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to delete temporary member');
        }
    },

    junior: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/members/junior/`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch junior members');
            return response.json();
        },
        create: async (memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/junior/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create junior member: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        },
        update: async (id, memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/junior/${id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(memberData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update junior member: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/members/junior/${id}/`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to delete junior member');
        }
    }
};

export default membersAPI;

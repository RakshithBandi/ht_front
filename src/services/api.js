import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // IMPORTANT: specific config to include cookies in cross-origin requests
    withCredentials: true,
});

// Function to get CSRF token from cookies
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
    (config) => {
        // CSRF protection for non-GET requests
        const csrfToken = getCookie('csrftoken');
        if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 errors globally if needed
        if (error.response && [401, 403].includes(error.response.status)) {
            console.error('Authentication Error:', error.response.data);
            // Optional: Redirect to login or clear auth state
        }
        return Promise.reject(error);
    }
);

export default api;

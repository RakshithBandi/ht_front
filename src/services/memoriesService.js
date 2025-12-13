import api from './api';

const memoriesAPI = {
    getAll: async () => {
        const response = await api.get('/api/memories/');
        return response.data;
    },

    create: async (memoryData) => {
        const config = {};

        if (memoryData instanceof FormData) {
            // We must explicitly unset the Content-Type header so the browser
            // can set it automatically with the correct boundary.
            // The default instance has 'application/json' which breaks uploads.
            config.headers = { "Content-Type": undefined };

            config.transformRequest = (data, headers) => {
                // Double check to remove the default json header from the headers object
                if (headers) {
                    if (headers['Content-Type']) delete headers['Content-Type'];
                    // Handle AxiosHeaders object if present
                    if (headers.delete) headers.delete('Content-Type');
                }
                return data;
            };
        }

        const response = await api.post('/api/memories/', memoryData, config);
        return response.data;
    },

    update: async (id, memoryData) => {
        const response = await api.put(`/api/memories/${id}/`, memoryData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/memories/${id}/`);
        return response.data;
    }
};

export default memoriesAPI;

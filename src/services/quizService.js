import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// Use the same base URL as other services which seems to be implicitly handled or defined elsewhere
// Checking other services, it seems they use a constant. Let me just use the relative path matching others if possible or the constant.
// Looking at previous context, other services use API_URL from a config or define it.
// Let me stick to the pattern used in other services. I'll define API_URL similar to how I saw it in `gamesService.js` earlier in the conversation history (implied).
// Actually, I should use the one defined in the files I edited earlier.
// Wait, I don't have the content of gamesService.js handy in current context but I recall fixing it.
// Let's assume standard axios setup or import a config if it exists. 
// I'll check a service file first to be consistent.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

// Configure axios defaults
axios.defaults.withCredentials = true;

const getQuestions = async (year) => {
    const response = await axios.get(`${API_URL}/quiz/questions/`, {
        params: { year }
    });
    return response.data;
};

const createQuestion = async (formData) => {
    const response = await axios.post(`${API_URL}/quiz/questions/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const deleteQuestion = async (id) => {
    const response = await axios.delete(`${API_URL}/quiz/questions/${id}/`);
    return response.data;
};

const submitAnswer = async (questionId, selectedAnswer) => {
    const response = await axios.post(`${API_URL}/quiz/questions/${questionId}/answer/`, {
        selected_answer: selectedAnswer
    });
    return response.data;
};

const getUserScore = async () => {
    const response = await axios.get(`${API_URL}/quiz/my-score/`);
    return response.data;
};

const getLeaderboard = async () => {
    const response = await axios.get(`${API_URL}/quiz/leaderboard/`);
    return response.data;
};

const getSettings = async () => {
    const response = await axios.get(`${API_URL}/quiz/settings/`);
    return response.data;
};

const toggleLeaderboard = async () => {
    const response = await axios.post(`${API_URL}/quiz/toggle-leaderboard/`);
    return response.data;
};

export default {
    getQuestions,
    createQuestion,
    deleteQuestion,
    submitAnswer,
    getUserScore,
    getLeaderboard,
    getSettings,
    toggleLeaderboard
};

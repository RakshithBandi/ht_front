import api from './api';

const getQuestions = async (year) => {
    const response = await api.get('/api/quiz/questions/', {
        params: { year }
    });
    return response.data;
};

const createQuestion = async (formData) => {
    const response = await api.post('/api/quiz/questions/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const deleteQuestion = async (id) => {
    const response = await api.delete(`/api/quiz/questions/${id}/`);
    return response.data;
};

const submitAnswer = async (questionId, selectedAnswer) => {
    const response = await api.post(`/api/quiz/questions/${questionId}/answer/`, {
        selected_answer: selectedAnswer
    });
    return response.data;
};

const getUserScore = async () => {
    const response = await api.get('/api/quiz/my-score/');
    return response.data;
};

const getLeaderboard = async () => {
    const response = await api.get('/api/quiz/leaderboard/');
    return response.data;
};

const getSettings = async () => {
    const response = await api.get('/api/quiz/settings/');
    return response.data;
};

const toggleLeaderboard = async () => {
    const response = await api.post('/api/quiz/toggle-leaderboard/');
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

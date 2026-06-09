import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getAllQuizzes = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_ALL_QUIZZES);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get quizzes' };
    }
};

const getQuizzesForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get quizzes' };
    }
};

const getQuizById = async (id) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get quiz' };
    }
};

const submitQuiz = async (id, answerData) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(id), answerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit quiz answer' };
    }
};

const getQuizResults = async (id) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get quiz results' };
    }
};

const deleteQuiz = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete quiz' };
    }
};

const quizService = {
    getAllQuizzes,
    getQuizzesForDocument,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
};

export default quizService;

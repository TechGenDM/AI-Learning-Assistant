import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const handleApiError = (error, defaultMessage) => {
    if (error.response?.data) {
        // Backend usually sends the error string under "error"
        throw new Error(error.response.data.error || error.response.data.message || defaultMessage);
    }
    throw new Error(defaultMessage);
};

const generateFlashcards = async (documentId, content) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARD, {documentId, content});
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to generate Flashcards');
    }
};

const generateQuiz = async (documentId, content) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {documentId, content});
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to generate Quiz');
    }
};

const generateSummary = async (documentId, content) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId, content});
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to generate Summary');
    }
};

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, {documentId, message});
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to generate Chat');
    }
};

const explainConcept = async (documentId, concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {documentId, concept});
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to generate Explanation');
    }
};

const getChatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to get Chat History');
    }
};

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
};

export default aiService;
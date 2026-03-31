import axios from "axios";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashcards = async (documentId, content) => {
    try {
        const response = await axios.post(API_PATHS.AI.GENERATE_FLASHCARD, {documentId, content});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Flashcards' };
    }
};

const generateQuiz = async (documentId, content) => {
    try {
        const response = await axios.post(API_PATHS.AI.GENERATE_QUIZ, {documentId, content});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Quiz' };
    }
};

const generateSummary = async (documentId, content) => {
    try {
        const response = await axios.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId, content});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Summary' };
    }
};

const chat = async (documentId, message) => {
    try {
        const response = await axios.post(API_PATHS.AI.CHAT, {documentId, message});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Chat' };
    }
};

const explainConcept = async (documentId, concept) => {
    try {
        const response = await axios.post(API_PATHS.AI.EXPLAIN_CONCEPT, {documentId, concept});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate Explanation' };
    }
};

const getChatHistory = async (documentId) => {
    try {
        const response = await axios.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get Chat History' };
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
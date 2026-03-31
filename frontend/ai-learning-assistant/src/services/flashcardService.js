import axios from "axios";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const getFlashcardSets = async (documentId) => {
    try {
        const response = await axios.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get flashcards' };
    }
};

const getFlashcardsForDocument = async (documentId) => {
    try {
        const response = await axios.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOCUMENT(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get flashcards for document' };
    }
};

const reviewFlashcard = async (cardId, reviewData) => {
    try {
        const response = await axios.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARDS(cardId), reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to review flashcard' };
    }
};

const toggleStar = async (cardId) => {
    try {
        const response = await axios.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to toggle star' };
    }
};

const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete flashcard set' };
    }
};

const flashcardService = {
    getFlashcardSets,
    getFlashcardsForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet,
};

export default flashcardService;
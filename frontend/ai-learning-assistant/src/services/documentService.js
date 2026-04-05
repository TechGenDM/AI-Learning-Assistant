import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const uploadDocument = async (formData) => {
    try {
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to upload document';
        throw new Error(errorMessage);
    }
};

const getDocuments = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to get documents';
        throw new Error(errorMessage);
    }
};

const getDocumentById = async (id) => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to get document';
        throw new Error(errorMessage);
    }
};

const updateDocument = async (id, documentData) => {
    try {
        const response = await axiosInstance.put(API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(id), documentData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update document';
        throw new Error(errorMessage);
    }
};

const deleteDocument = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete document';
        throw new Error(errorMessage);
    }
};

const documentService = {
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
};

export default documentService;
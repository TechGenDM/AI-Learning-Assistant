import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password});
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An unknown error occurred';
        throw new Error(errorMessage);
    }
};

const register = async (username, email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {username, email, password});
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An unknown error occurred';
        throw new Error(errorMessage);
    }
};

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An unknown error occurred';
        throw new Error(errorMessage);
    }
};

const updateProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, profileData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An unknown error occurred';
        throw new Error(errorMessage);
    }
};

const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {currentPassword, newPassword});
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An unknown error occurred';
        throw new Error(errorMessage);
    }
};

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
};

export default authService;
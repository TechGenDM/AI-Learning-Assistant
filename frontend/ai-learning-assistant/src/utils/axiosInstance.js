import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {return response;},
    (error) => {
        if(error.response) {
            if (error.response.status === 401) {
                // Token expired or unauthorized
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Only redirect if we're not already on the login page to avoid loops
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else if (error.response.status === 500){
                console.error("Server Error: ", error.response.data.message);
            }
        } else if (error.code === "ECONNABORTED"){
            console.error("Request timeout. Please try again.")
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
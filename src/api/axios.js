import { deleteCookie, getCookie } from "@/helper/Cookie";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {
        const token = getCookie("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response && error.response.status === 401) {
            deleteCookie("token")
            deleteCookie("refreshToken")
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

export default api;

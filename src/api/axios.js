import { deleteCookie, getCookie } from "@/helper/Cookie";
import axios from "axios";

const api = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

let instance = null
const getInstance = async () => {
    if (instance) return instance
    const res = await fetch('/config.json');
    const data = await res.json();
    instance = data
    return data
}
api.interceptors.request.use(
    async (config) => {
        const token = getCookie("token")
        const data = instance ?? await getInstance();
        config.baseURL = data.API_URL;

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

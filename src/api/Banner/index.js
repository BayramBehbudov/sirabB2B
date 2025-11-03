'use server'
import api from "../axios";

export const GetAllBanners = async () => {
    try {
        const res = await api.get(`Banner/GetAllBanners`);
        return res.data;
    } catch (error) {
        console.log('error at GetAllBanners', error);
        throw error;
    }
};



export const BannerCreate = async (data) => {
    try {
        const response = await api.post("/Banner/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at BannerCreate', error);
        throw error;
    }
};

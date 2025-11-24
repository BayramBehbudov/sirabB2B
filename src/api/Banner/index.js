'use server'
import api from "../axios";

export const GetAllBanners = async (payload) => {
    try {

        // {
        //   "pageNumber": 0,
        //   "pageSize": 0,
        //   "order": "string",
        //   "orderColumn": "string",
        //   "searchList": [
        //     {
        //       "colName": "string",
        //       "value": "string"
        //     }
        //   ]
        // }
        const res = await api.post(`Banner/GetAllBanners`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllBanners', error);
        throw error;
    }
};



export const BannerCreate = async (data) => {
    // {
    //   "sendToAllCustomers": true,
    //   "title": "string",
    //   "description": "string",
    //   "startDate": "2025-11-11T08:52:05.049Z",
    //   "endDate": "2025-11-11T08:52:05.049Z",
    //   "b2BCustomerIds": [
    //     0
    //   ],
    //   "b2BCustomerGroupIds": [
    //     0
    //   ],
    //   "bannerImageDtos": [
    //     {
    //       "fileName": "string",
    //       "base64": "string",
    //       "bannerId": 0
    //     }
    //   ]
    // }


    try {
        const response = await api.post("/Banner/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at BannerCreate', error);
        throw error;
    }
};

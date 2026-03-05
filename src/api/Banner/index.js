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
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "title": "string",
    //   "description": "string",
    //   "startDate": "2026-03-05T07:52:13.050Z",
    //   "endDate": "2026-03-05T07:52:13.050Z",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "bannerImageDtos": [
    //     {
    //       "fileName": "string",
    //       "base64": "string"
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



export const BannerUpdate = async (data) => {
    // {
    //   "id": 0,
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "title": "string",
    //   "description": "string",
    //   "startDate": "2026-03-05T07:53:09.825Z",
    //   "endDate": "2026-03-05T07:53:09.825Z",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "bannerImageDtos": [
    //     {
    //       "id": 0,
    //       "fileName": "string",
    //       "base64": "string"
    //     }
    //   ],
    //   "deletedBannerImageIds": [
    //     0
    //   ]
    // }



    try {
        const response = await api.put("/Banner/Update", data);
        return response.data;
    } catch (error) {
        console.log('error at BannerUpdate', error);
        throw error;
    }
};


export const DeleteBanner = async (id) => {

    try {
        const response = await api.put(`/Banner/DeleteBanner/${id}`);
        return response.data;
    } catch (error) {
        console.log('error at DeleteBanner', error);
        throw error;
    }
};
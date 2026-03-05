import api from "../axios";

export const GetAllPromoPopups = async (payload) => {
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

        const res = await api.post(`PromoPopup/GetAllPromoPopups`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllPromoPopups', error);
        throw error;
    }
};



export const PromoPopupCreate = async (data) => {
    // {
    //   "title": "string",
    //   "description": "string",
    //   "startDate": "2026-03-05T07:26:58.236Z",
    //   "endDate": "2026-03-05T07:26:58.236Z",
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "promoPopupImageDtos": [
    //     {
    //       "fileName": "string",
    //       "base64": "string"
    //     }
    //   ]
    // }

    try {
        const response = await api.post("/PromoPopup/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at PromoPopupCreate', error);
        throw error;
    }
};



export const PromoPopupUpdate = async (data) => {

    // {
    //   "id": 0,
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "title": "string",
    //   "description": "string",
    //   "startDate": "2026-03-05T07:26:58.241Z",
    //   "endDate": "2026-03-05T07:26:58.241Z",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "promoPopupImageDtos": [
    //     {
    //       "id": 0,
    //       "fileName": "string",
    //       "base64": "string"
    //     }
    //   ],
    //   "deletedPromoPopupImageIds": [
    //     0
    //   ]
    // }


    try {
        const response = await api.put("/PromoPopup/Update", data);
        return response.data;
    } catch (error) {
        console.log('error at PromoPopupUpdate', error);
        throw error;
    }
};



export const DeletePromoPopUp = async (id) => {

    try {
        const response = await api.put(`/PromoPopup/DeletePromoPopUp/${id}`);
        return response.data;
    } catch (error) {
        console.log('error at DeletePromoPopUp', error);
        throw error;
    }
};
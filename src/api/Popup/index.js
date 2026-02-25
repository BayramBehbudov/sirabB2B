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
    //   "promoPopupImageDtos": [
    //     {
    //       "fileName": "string",
    //       "base64": "string",
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
    //     "id": 0,
    //     "title": "string",
    //     "description": "string",
    //     "sendToAllCustomers": true,
    //     "startDate": "2025-11-25T09:19:49.160Z",
    //     "endDate": "2025-11-25T09:19:49.160Z",
    //     "b2BCustomerIds": [0],
    //     "customerGroupIds": [0],
    //     "promoPopupImageDtos": [
    //       {
    //         "id": 0,
    //         "fileName": "string",
    //         "base64": "string"
    //       }
    //     ]
    //     "deletedPromoPopupImageIds": [
    //       0
    //     ]
    //   }


    try {
        const response = await api.put("/PromoPopup/Update", data);
        return response.data;
    } catch (error) {
        console.log('error at PromoPopupUpdate', error);
        throw error;
    }
};

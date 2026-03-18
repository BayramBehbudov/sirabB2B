import api from "../axios";

export const GetAllInventoryRequirements = async (payload) => {
    // {
    //     "pageNumber": 0,
    //     "pageSize": 0,
    //     "order": "string",
    //     "orderColumn": "string",
    //     "searchList": [
    //       {
    //         "colName": "string",
    //         "value": "string"
    //       }
    //     ]
    //   }

    try {
        const res = await api.post(`InventoryCheckRequirement/GetAllInventoryRequirements`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllInventoryRequirements', error);
        throw error;
    }
};

export const CreateInventoryCheckRequirement = async (data) => {

    // "customerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "startDate": "2026-03-11T08:01:15.961Z",
    //   "endDate": "2026-03-11T08:01:15.961Z",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "requiredPhotoCount": 0,
    //   "description": "string",
    //   "erpCode": "string",
    //   "serialCode": "string"


    try {
        const res = await api.post(`InventoryCheckRequirement/CreateInventoryCheckRequirement`, data);
        return res.data;
    } catch (error) {
        console.log('error at CreateInventoryCheckRequirement', error);
        throw error;
    }
};
export const UpdateInventoryCheckRequirement = async (data) => {
    //    "id": 0,
    // "customerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "startDate": "2026-03-11T08:01:15.961Z",
    //   "endDate": "2026-03-11T08:01:15.961Z",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "requiredPhotoCount": 0,
    //   "description": "string",
    //   "erpCode": "string",
    //   "serialCode": "string"

    try {
        const res = await api.put(`InventoryCheckRequirement/UpdateInventoryCheckRequirement`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateInventoryCheckRequirement', error);
        throw error;
    }
};



export const GetAllInventoryAnswers = async (payload) => {
    // {
    //     "pageNumber": 0,
    //     "pageSize": 0,
    //     "order": "string",
    //     "orderColumn": "string",
    //     "searchList": [
    //       {
    //         "colName": "string",
    //         "value": "string"
    //       }
    //     ]
    //   }



    try {
        const res = await api.post(`InventoryCheckRequirement/GetAllInventoryAnswers`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllInventoryAnswers', error);
        throw error;
    }
};



export const UpdateInventoryAnswer = async (data) => {

    // {
    //   "id": 0,
    //   "isConfirmed": true,
    //   "rejectNote": "string"
    // }

    try {
        const res = await api.post(`InventoryCheckRequirement/UpdateInventoryAnswer`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateInventoryAnswer', error);
        throw error;
    }
};
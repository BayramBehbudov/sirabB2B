'use server'
import api from "../axios";

export const GetAllDiscountConditions = async (payload) => {
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
        const res = await api.post(`DiscountCondition/GetAllDashboardDiscountConditions`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllDiscountConditions', error);
        throw error;
    }
};



export const CreateDiscountCondition = async (data) => {
    // {
    //     "b2BCustomerGroupIds": [0],
    //     "b2BCustomerIds": [0],
    //     "sendToAllCustomers": true,
    //     "startDate": "2025-11-25T09:10:32.518Z",
    //     "endDate": "2025-11-25T09:10:32.518Z",
    //     "description": "string",
    //     "discountConditionLines": [
    //       {
    //         "price": 0,
    //         "isVAT": true,
    //         "productId": 0
    //       }
    //     ]
    //   }

    try {
        const res = await api.post(`DiscountCondition/CreateDiscountCondition`, data);
        return res.data;
    } catch (error) {
        console.log('error at CreateDiscountCondition', error);
        throw error;
    }
};

export const UpdateDiscountCondition = async (data) => {
    // {
    //     "id": 0,
    //     "sendToAllCustomers": true,
    //     "b2BCustomerGroupIds": [0],
    //     "b2BCustomerIds": [0],
    //     "startDate": "2025-11-25T09:11:11.254Z",
    //     "endDate": "2025-11-25T09:11:11.254Z",
    //     "description": "string",
    //     "discountConditionLines": [
    //       {
    //         "id": 0,
    //         "price": 0,
    //         "isVAT": true,
    //         "productId": 0
    //       }
    //     ]
    //   }

    try {
        const res = await api.put(`DiscountCondition/UpdateDiscountCondition`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateDiscountCondition', error);
        throw error;
    }
};

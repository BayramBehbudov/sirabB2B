'use server'
import api from "../axios";

export const GetAllSaleCondtions = async (payload) => {
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
        const res = await api.post(`SaleCondition/GetAllDashboardSaleCondtions`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllSaleCondtions', error);
        throw error;
    }
};



export const CreateSaleCondition = async (data) => {
    // {
    //     "customerGroupIds": [
    //       0
    //     ],
    //     "b2BCustomerIds": [
    //       0
    //     ],
    //     "sendToAllCustomers": true,
    //     "startDate": "2025-11-25T09:10:32.518Z",
    //     "endDate": "2025-11-25T09:10:32.518Z",
    //     "description": "string",
    //     "saleConditionLines": [
    //       {
    //         "price": 0,
    //         "isVAT": true,
    //         "productId": 0
    //       }
    //     ]
    //   }
    try {
        const res = await api.post(`SaleCondition/CreateSaleCondition`, data);
        return res.data;
    } catch (error) {
        console.log('error at CreateSaleCondition', error);
        throw error;
    }
};

export const UpdateSaleCondition = async (data) => {
    // {
    //     "id": 0,
    //     "sendToAllCustomers": true,
    //     "customerGroupIds": [
    //       0
    //     ],
    //     "b2BCustomerIds": [
    //       0
    //     ],
    //     "startDate": "2025-11-25T09:11:11.254Z",
    //     "endDate": "2025-11-25T09:11:11.254Z",
    //     "description": "string",
    //     "saleConditionLines": [
    //       {
    //         "id": 0,
    //         "price": 0,
    //         "isVAT": true,
    //         "productId": 0
    //       }
    //     ]
    //   }
    try {
        const res = await api.put(`SaleCondition/UpdateSaleCondition`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateSaleCondition', error);
        throw error;
    }
};

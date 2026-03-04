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
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "startDate": "2026-03-04T07:30:53.611Z",
    //   "endDate": "2026-03-04T07:30:53.611Z",
    //   "description": "string",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "saleConditionLines": [
    //     {
    //       "price": 0,
    //       "isVAT": true,
    //       "productId": 0
    //     }
    //   ]
    // }

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
    //   "id": 0,
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "startDate": "2026-03-04T08:44:57.723Z",
    //   "endDate": "2026-03-04T08:44:57.723Z",
    //   "description": "string",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "deletedLineIds": [
    //     0
    //   ],
    //   "saleConditionLines": [
    //     {
    //       "id": 0,
    //       "price": 0,
    //       "isVAT": true,
    //       "productId": 0
    //     }
    //   ]
    // }
    try {
        const res = await api.put(`SaleCondition/UpdateSaleCondition`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateSaleCondition', error);
        throw error;
    }
};

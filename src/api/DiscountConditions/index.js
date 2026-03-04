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
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //     "startDate": "2026-03-04T11:34:54.858Z",
    //     "endDate": "2026-03-04T11:34:54.858Z",
    //     "description": "string",
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "isActive": true,
    //   "discountConditionLines": [
    //     {
    //       "discountPercentage": 0,
    //       "isVAT": true,
    //       "productId": 0
    //     }
    //   ]
    // }
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
    //   "id": 0,
    //   "b2BCustomerGroupId": 0,
    //   "b2BCustomerId": 0,
    //   "startDate": "2026-03-04T11:35:44.105Z",
    //   "endDate": "2026-03-04T11:35:44.105Z",
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
    //   "discountConditionLines": [
    //     {
    //       "id": 0,
    //       "discountPercentage": 0,
    //       "isVAT": true,
    //       "productId": 0
    //     }
    //   ]
    // }



    try {
        const res = await api.put(`DiscountCondition/UpdateDiscountCondition`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateDiscountCondition', error);
        throw error;
    }
};

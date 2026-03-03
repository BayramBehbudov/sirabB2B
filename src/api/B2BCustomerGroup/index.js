import api from "../axios";

export const createCustomerGroup = async (data) => {
    // {
    //   "name": "string"
    // }
    try {
        const response = await api.post("/B2BCustomerGroup/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at B2BCustomerGroup/Create', error);
        throw error;
    }
};

export const getAllCustomerGroup = async () => {
    try {
        const response = await api.get("/B2BCustomerGroup/GetAll");
        return response.data;
    } catch (error) {
        console.log('error at B2BCustomerGroup/GetAll', error);
        throw error;
    }
};

export const GetB2BCustomerByGroupId = async (id, data) => {
    try {
        // {
        //   "pageNumber": 1,
        //   "pageSize": 10,
        //   "order": "string",
        //   "orderColumn": "string",
        //   "searchList": [
        //     {
        //       "colName": "string",
        //       "value": "string"
        //     }
        //   ]
        // }
        const response = await api.post(`/B2BCustomerGroup/GetB2BCustomerByGroupId/${id}`, data);
        return response.data;
    } catch (error) {
        console.log('error at GetB2BCustomerByGroupId', error);
        throw error;
    }
};

export const updateCustomerGroup = async (data) => {
    // {
    //   "id": 0,
    //   "name": "string"
    // }
    try {
        const response = await api.put(`/B2BCustomerGroup/Update`, data);
        return response.data;
    } catch (error) {
        console.log('error at B2BCustomerGroup/Update', error);
        throw error;
    }
};

export const SetB2BCustomerToGroup = async (data) => {
    // {
    //   "id": 0,
    //   "customerId": 0,
    //   "isSelected": true
    // }
    try {
        const response = await api.put(`/B2BCustomerGroup/SetB2BCustomerToGroup`, data);
        return response.data;
    } catch (error) {
        console.log('error at SetB2BCustomerToGroup', error);
        throw error;
    }
};


export const deleteCustomerGroup = async (id) => {
    try {
        const response = await api.put(`/B2BCustomerGroup/Delete/${id}`);
        return response.data;
    } catch (error) {
        console.log('error at B2BCustomerGroup/Delete', error);
        throw error;
    }
};

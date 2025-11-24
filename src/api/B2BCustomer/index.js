import api from "../axios";

export const createB2BCustomer = async (data) => {
    // {
    //   "customerGroupId": 0,
    //   "erpId": "string",
    //   "taxId": "string",
    //   "phoneNumber": "string",
    //   "email": "string",
    //   "contactPersonFirstName": "string",
    //   "contactPersonLastName": "string",
    //   "companyName": "string",
    //   "password": "string"
    // }
    try {
        const response = await api.post("/B2BCustomer/CreateB2BCustomer", data);
        return response.data;
    } catch (error) {
        console.log('error at createB2BCustomer', error);
        throw error;
    }
};

export const getB2BCustomers = async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
        const res = await api.get(`/B2BCustomer/GetB2BCustomers?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return res.data;
    } catch (error) {
        console.log('error at getB2BCustomers', error);
        throw error;
    }
};


export const editB2BCustomer = async (data) => {
    // {
    //   "b2BCustomerId": 0,
    //   "customerGroupId": 0,
    //   "erpId": "string",
    //   "taxId": "string",
    //   "phoneNumber": "string",
    //   "email": "string",
    //   "contactPersonFirstName": "string",
    //   "contactPersonLastName": "string",
    //   "companyName": "string"
    // }
    try {
        const response = await api.put("/B2BCustomer/UpdateB2BCustomerProfileByAdmin", data);
        return response.data;
    } catch (error) {
        console.log('error at editB2BCustomer', error);
        throw error;
    }
};
export const editB2BCustomerPassword = async (data) => {
    // {
    //   "b2BCustomerId": 0,
    //   "password": "string"
    // }
    try {
        const response = await api.put("/B2BCustomer/UpdateB2BCustomerPassword", data);
        return response.data;
    } catch (error) {
        console.log('error at editB2BCustomerPassword', error);
        throw error;
    }
};


export const confirmB2BCustomerProfile = async (data) => {
    // {
    //   "b2BCustomerId": 0,
    //   "isConfirmed": true
    // }

    try {
        const response = await api.put("/B2BCustomer/ConfirmB2BCustomerProfileInfo", data);
        return response.data;
    } catch (error) {
        console.log('error at confirmB2BCustomerProfile', error);
        throw error;
    }
};


export const setB2BCustomerStatus = async (data) => {
    // {
    //   "id": 0,
    //   "isActive": true
    // }

    try {
        const response = await api.patch("/B2BCustomer/SetB2BCustomerStatus", data);
        return response.data;
    } catch (error) {
        console.log('error at setB2BCustomerStatus', error);
        throw error;
    }
};
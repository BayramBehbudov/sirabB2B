import api from "../axios";

export const createCustomerGroup = async (data) => {
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

// export const getGroupById = async (id) => {
//     try {
//         const response = await api.get(`/B2BCustomerGroup/GetById/${id}`);
//         return response.data;
//     } catch (error) {
//         console.log('error at B2BCustomerGroup/GetById', error);
//         throw error;
//     }
// };

export const updateCustomerGroup = async (data) => {
    try {
        const response = await api.put(`/B2BCustomerGroup/Update`, data);
        return response.data;
    } catch (error) {
        console.log('error at B2BCustomerGroup/Update', error);
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

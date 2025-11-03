import api from "../axios";

export const loginAuth = async (data) => {
    try {
        const response = await api.post("/Auth/VerifyUser", data);
        return response.data.data;
    } catch (error) {
        console.log('error at loginAuth', error);
        throw error;
    }
};



export const AuthCreate = async (data) => {
    try {
        const response = await api.post("/Auth/CreateUser", data);
        return response.data;
    } catch (error) {
        console.log('error at AuthCreate', error);
        throw error;
    }
};



export const RefreshToken = async (token) => {
    try {
        const response = await api.get(`/Auth/${token}`,);
        return response.data.data;
    } catch (error) {
        console.log('error at RefreshToken', error);
        throw error;
    }
};
export const GetUserClaims = async () => {
    try {
        const response = await api.get(`/Auth/GetUserClaims`,);
        return response.data.data;
    } catch (error) {
        console.log('error at RefreshToken', error);
        throw error;
    }
};

export const GetAllSystemUsers = async ({ pageNumber = 1, pageSize = 10 }) => {
    try {

        const response = await api.get(`/Auth/GetAllSystemUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`,);
        return response.data
    } catch (error) {
        console.log('error at GetAllSystemUsers', error);
        throw error;
    }
};


export const ResetPassword = async (data) => {
    try {
        const response = await api.patch(`/Auth/resetPassword`, data);
        return response.data
    } catch (error) {
        console.log('error at ResetPassword', error);
        throw error;
    }
};

export const LogOut = async () => {
    try {
        const response = await api.get(`/Auth/logOut`,);
        return response.data
    } catch (error) {
        console.log('error at LogOut', error);
        throw error;
    }
};

export const SetSystemUserStatus = async (data) => {
    try {
        const response = await api.patch(`/Auth/SetSystemUserStatus`, data);
        return response.data
    } catch (error) {
        console.log('error at ResetPassword', error);
        throw error;
    }
};



export const GetClaimGroupsByUserId = async (userId, { pageNumber = 1, pageSize = 10 }) => {
    try {
        const response = await api.get(`/Auth/GetClaimGroupsByUserId/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data
    } catch (error) {
        console.log('error at GetClaimGroupsByUserId', error);
        throw error;
    }
};





export const SetUserPermission = async (data) => {
    // {
    //   "claimGroupId": 0,
    //   "systemUserId": 0,
    //   "selected": true
    // }
    try {
        const response = await api.put(`/Auth/SetUserPermission`, data);
        return response.data
    } catch (error) {
        console.log('error at SetUserPermission', error);
        throw error;
    }
};

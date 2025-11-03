import api from "../axios";

export const GetClaimGroups = async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
        const response = await api.get(`/ClaimGroup/GetAllClaimGroups?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.log('error at GetClaimGroups', error);
        throw error;
    }
}

export const CreateClaimGroup = async (data) => {
    try {
        const response = await api.post("/ClaimGroup/CreateClaimGroup", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateClaimGroup', error);
        throw error;
    }
};

export const UpdateClaimGroup = async (data) => {
    try {
        const response = await api.put("/ClaimGroup/UpdateClaimGroup", data);
        return response.data;
    } catch (error) {
        console.log('error at UpdateClaimGroup', error);
        throw error;
    }
};



export const GetPermissionsByGroupId = async (claimGroupId, pageNumber = 1, pageSize = 10) => {
    try {
        const response = await api.get(`/ClaimGroup/GetClaimsByGroupId/${claimGroupId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.log('error at GetPermissionsByGroupId', error);
        throw error;
    }
}


export const SetPermissionSelected = async (data) => {
    // {
    //   "claimGroupId": 0,
    //   "principalName": "string",
    //   "selected": true
    // }
    try {
        const response = await api.put(`/ClaimGroup/SetPermission`, data);
        return response.data;
    } catch (error) {
        console.log('error at SetPermissionSelected', error);
        throw error;
    }
}

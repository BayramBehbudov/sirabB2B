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

export const InventoryCheckRequirementAdd = async (data) => {
    // {
    //     "sendToAllCustomers": true,
    //     "requiredPhotoCount": 0,
    //     "description": "string",
    //     "b2BCustomerIds": [0],
    //     "b2BCustomerGroupIds": [0]
    //   }

    try {
        const res = await api.post(`InventoryCheckRequirement/Add`, data);
        return res.data;
    } catch (error) {
        console.log('error at InventoryCheckRequirementAdd', error);
        throw error;
    }
};



export const GetAllInventoryAssignments = async (payload) => {
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
        const res = await api.post(`InventoryCheckRequirement/GetAllInventaryAssignments`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllInventoryAssignments', error);
        throw error;
    }
};



export const UpdateInventoryCheckAssignment = async (data) => {
    // {
    //     "inventoryCheckAssignmentId": 0,
    //     "isConfirmed": true
    // }

    try {
        const res = await api.put(`InventoryCheckRequirement/UpdateInventoryCheckAssignment`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateInventoryCheckAssignment', error);
        throw error;
    }
};
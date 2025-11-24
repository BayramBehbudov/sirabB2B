import api from "../axios";

export const CreateNotificationType = async (data) => {
    // {
    //   "name": "string",
    //   "iconFileName": "string",
    //   "soundFileName": "string",
    //   "iconBase64": "string"
    // }
    try {
        const response = await api.post("/NotificationType/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateNotificationType', error);
        throw error;
    }
};

export const UpdateNotificationType = async (data) => {
    // {
    //   "id": 0,
    //   "name": "string",
    //   "iconFileName": "string",
    //   "soundFileName": "string",
    //   "iconBase64": "string"
    // }
    try {
        const response = await api.put("/NotificationType/Update", data);
        return response.data;
    } catch (error) {
        console.log('error at UpdateNotificationType', error);
        throw error;
    }
};


export const DeleteNotificationType = async (id) => {
    try {
        const response = await api.put(`/NotificationType/Delete?id=${id}`,);
        return response.data;
    } catch (error) {
        console.log('error at DeleteNotificationType', error);
        throw error;
    }
};


export const GetNotificationTypes = async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
        const response = await api.get(`/NotificationType/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.log('error at GetNotificationTypes', error);
        throw error;
    }
};

export const CreateNotificationTemplate = async (data) => {
    try {
        const response = await api.post("/NotificationTemplate/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateNotificationTemplate', error);
        throw error;
    }
};


export const UpdateNotificationTemplate = async (data) => {
    try {
        const response = await api.put("/NotificationTemplate/Update", data);
        return response.data;
    } catch (error) {
        console.log('error at UpdateNotificationTemplate', error);
        throw error;
    }
};

export const GetNotificationTemplates = async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
        const response = await api.get(`/NotificationTemplate/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.log('error at GetNotificationTemplates', error);
        throw error;
    }
};

export const DeleteNotificationTemplates = async (id) => {
    try {
        const response = await api.delete(`NotificationTemplate/Delete/${id}`);
        return response.data;
    } catch (error) {
        console.log('error at DeleteNotificationTemplates', error);
        throw error;
    }
};




export const GetAllNotifications = async ({ pageNumber = 1, pageSize = 10 }) => {
    try {
        const response = await api.get(`/Notification/GetAllNotification?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.log('error at GetAllNotifications', error);
        throw error;
    }
};



export const CreateNotification = async (data) => {
    // {
    //  "b2BCustomerGroupIds": [
    //     0
    //   ],
    //   "b2BCustomerIds": [
    //     0
    //   ],
    //   "sendToAllCustomers": true,
    
    //   "notificationTypeId": 0,
    //   "notificationTemplateId": 0,
    //   "sendDate": "2025-11-11T09:08:11.807Z",
    //   "images": [
    //     {
    //       "fileName": "string",
    //       "base64": "string",
    //     }
    //   ]
    // }




    try {
        const response = await api.post("/Notification/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateNotification', error);
        throw error;
    }
};

// qeyd update delete yazılmayıb
// qeyd NotificationRecipient yazılmayıb
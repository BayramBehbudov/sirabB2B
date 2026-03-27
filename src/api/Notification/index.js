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


export const GetNotificationTypes = async (payload) => {
    try {
        const response = await api.post(`/NotificationType/GetAll`, payload);
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

export const GetNotificationTemplates = async (payload) => {
    try {
        const response = await api.post(`/NotificationTemplate/GetAll`, payload);
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




export const GetAllNotifications = async (payload) => {
    try {
        const response = await api.post(`/Notification/GetAllNotification`, payload);
        return response.data;
    } catch (error) {
        console.log('error at GetAllNotifications', error);
        throw error;
    }
};



export const CreateNotification = async (data) => {

    // {
    //   "b2BCustomerId": 0,
    //   "customerGroupId": 0,
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "notificationTypeId": 0,
    //   "notificationTemplateId": 0,
    //   "scheduledAt": "2026-03-27T06:47:23.088Z",
    //   "images": [
    //     {
    //       "fileName": "string",
    //       "base64": "string"
    //     }
    //   ]
    // }


    try {
        const response = await api.post("/Notification/CreateNotification", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateNotification', error);
        throw error;
    }
};


export const UpdateNotification = async (data) => {


    // {
    //   "id": 0,
    //   "b2BCustomerId": 0,
    //   "customerGroupId": 0,
    //   "clSpecode": "string",
    //   "clSpecode1": "string",
    //   "clSpecode2": "string",
    //   "clSpecode3": "string",
    //   "clSpecode4": "string",
    //   "clSpecode5": "string",
    //   "b2BCustomerType": "string",
    //   "notificationTypeId": 0,
    //   "notificationTemplateId": 0,
    //   "scheduledAt": "2026-03-27T06:54:08.243Z",
    //   "deletedNotificationImageIds": [
    //     0
    //   ],
    //   "images": [
    //     {
    //       "id": 0,
    //       "fileName": "string",
    //       "base64": "string"
    //     }
    //   ]
    // }


    try {
        const response = await api.put("/Notification/Update", data);
        return response.data;
    } catch (error) {
        console.log('error at UpdateNotification', error);
        throw error;
    }
};


export const DeleteNotification = async (id) => {
    try {
        const response = await api.put(`Notification/Delete/${id}`);
        return response.data;
    } catch (error) {
        console.log('error at DeleteNotification', error);
        throw error;
    }
};


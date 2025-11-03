import api from "../axios";

export const CreateNotificationType = async (data) => {
    try {
        const response = await api.post("/NotificationType/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at createNotificationType', error);
        throw error;
    }
};

export const UpdateNotificationType = async (data) => {
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

export const GetNotificationTypes = async () => {
    try {
        const response = await api.get("/NotificationType/GetAll");
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

export const GetNotificationTemplates = async () => {
    try {
        const response = await api.get("/NotificationTemplate/GetAll");
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




export const GetNotifications = async () => {
    try {
        const response = await api.get("/Notification/GetAllNotification");
        return response.data;
    } catch (error) {
        console.log('error at GetNotifications', error);
        throw error;
    }
};



export const CreateNotification = async (data) => {
    try {
        const response = await api.post("/Notification/Create", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateNotification', error);
        throw error;
    }
};
import api from "../axios";

export const CreateDocumentType = async (data) => {
    try {
        const response = await api.post("/DocumentType/CreateDocumentType", data);
        return response.data;
    } catch (error) {
        console.log('error at CreateDocumentType', error);
        throw error;
    }
};

export const GetAllDocumentTypes = async (payload) => {
    try {
        const response = await api.post(`/DocumentType/GetAllDocumentTypes`, payload);
        return response.data;
    } catch (error) {
        console.log('error at GetAllDocumentTypes', error);
        throw error;
    }
};


export const UpdateDocumentType = async (data) => {
    try {
        const response = await api.put(`/DocumentType/UpdateDocumentType`, data);
        return response.data;
    } catch (error) {
        console.log('error at UpdateDocumentType', error);
        throw error;
    }
};



export const DeleteDocumentType = async (id) => {
    try {
        const response = await api.put(`/DocumentType/DeleteDocumentType/${id}`);
        return response.data;
    } catch (error) {
        console.log('error at DeleteDocumentType', error);
        throw error;
    }
};





export const GetAllPendingDocuments = async (data) => {
    // {
    //   "pageNumber": 1,
    //   "pageSize": 10,
    //   "order": "",
    //   "orderColumn": "",
    //   "searchList": [
    //     {
    //       "colName": "",
    //       "value": ""
    //     }
    //   ]
    // }
    try {
        const response = await api.post(`/CustomerUploadedDocument/GetAllDocuments`, data);
        return response.data;
    } catch (error) {
        console.log('error at GetAllPendingDocuments', error);
        throw error;
    }
};



export const confirmDocument = async (data) => {
    //   "uploadedDocumentId": 0,
    //   "isConfirmed": true,
    //   "adminNote": "string"
    try {
        const response = await api.put(`/CustomerUploadedDocument/UpdateDocumentStatus`, data);
        return response.data;
    } catch (error) {
        console.log('error at confirmDocument', error);
        throw error;
    }
};


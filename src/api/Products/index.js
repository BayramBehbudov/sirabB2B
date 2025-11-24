'use server'
import api from "../axios";

// products
export const GetAllProducts = async (payload) => {
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
        const res = await api.post(`Product/GetAllDashboardProducts`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllProducts', error);
        throw error;
    }
};


export const CreateProduct = async (data) => {
    // {
    //     "erpId": "string",
    //     "name": "string",
    //     "description": "string",
    //     "productCategoryId": 0,
    //     "productUnits": [
    //       {
    //         "unitDefinitionId": 0,
    //         "unit": 0
    //       }
    //     ],
    //     "productPrices": [
    //       {
    //         "price": 0,
    //         "startDate": "2025-11-21T09:46:38.622Z",
    //         "endDate": "2025-11-21T09:46:38.622Z",
    //         "priority": 0,
    //         "isVAT": true
    //       }
    //     ],
    //     "productImages": [
    //       {
    //         "fileName": "string",
    //         "base64": "string"
    //       }
    //     ]
    //   }
    try {
        const res = await api.post(`Product/CreateProduct`, data);
        return res.data;
    } catch (error) {
        console.log('error at CreateProduct', error);
        throw error;
    }
};

export const UpdateProduct = async (data) => {
    // {
    //     "id": 0,
    //     "erpId": "string",
    //     "name": "string",
    //     "description": "string",
    //     "productCategoryId": 0,
    //     "productUnits": [
    //       {
    //         "id": 0,
    //         "unitDefinitionId": 0,
    //         "unit": 0
    //       }
    //     ],
    //     "deletedProductUnitIds": [
    //       0
    //     ],
    //     "productPrices": [
    //       {
    //         "id": 0,
    //         "price": 0,
    //         "startDate": "2025-11-24T06:55:34.630Z",
    //         "endDate": "2025-11-24T06:55:34.630Z",
    //         "priority": 0,
    //         "isVAT": true
    //       }
    //     ],
    //     "deletedProductPriceIds": [
    //       0
    //     ],
    //     "productImages": [
    //       {
    //         "id": 0,
    //         "fileName": "string",
    //         "base64": "string"
    //       }
    //     ],
    //     "deletedProductImageIds": [
    //       0
    //     ]
    //   }

    try {
        const res = await api.post(`Product/UpdateProduct`, data);
        return res.data;
    } catch (error) {
        console.log('error at CreateProduct', error);
        throw error;
    }
};
export const GetProductById = async (id) => {
    try {
        const res = await api.get(`Product/GetDashboardProduct/${id}`);
        return res.data;
    } catch (error) {
        console.log('error at GetProductById', error);
        throw error;
    }
};
// categories
export const GetAllProductCategories = async (payload) => {
    try {

        // {
        //   "pageNumber": 0,
        //   "pageSize": 0,
        //   "order": "string",
        //   "orderColumn": "string",
        //   "searchList": [
        //     {
        //       "colName": "string",
        //       "value": "string"
        //     }
        //   ]
        // }
        const res = await api.post(`ProductCategory/GetAllProductCategories`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllProductCategories', error);
        throw error;
    }
};


export const ProductCategoryCreate = async (data) => {
    try {

        // {
        //   "name": "string",
        //   "fileName": "string",
        //   "base64": "string"
        // }
        const res = await api.post(`ProductCategory/Create`, data);
        return res.data;
    } catch (error) {
        console.log('error at ProductCategoryCreate', error);
        throw error;
    }
};



export const ProductCategoryUpdate = async (data) => {
    try {

        // {
        //   "id": 0,
        //   "name": "string",
        //   "fileName": "string",
        //   "base64": "string"
        // }
        const res = await api.put(`ProductCategory/Update`, data);
        return res.data;
    } catch (error) {
        console.log('error at ProductCategoryUpdate', error);
        throw error;
    }
};

export const ProductCategoryDelete = async (id) => {
    try {
        const res = await api.put(`ProductCategory/Delete/${id}`);
        return res.data;
    } catch (error) {
        console.log('error at ProductCategoryUpdate', error);
        throw error;
    }
};


// units

export const GetAllUnitDefinition = async () => {
    try {
        const res = await api.get(`UnitDefinition/GetAll`);
        return res.data;
    } catch (error) {
        console.log('error at GetAllUnitDefinition', error);
        throw error;
    }
};




export const CreateUnitDefinition = async (data) => {
    // {
    //     "name": "string",
    //     "code": "string"
    // }

    try {
        const res = await api.post(`UnitDefinition/Create`, data);
        return res.data;
    } catch (error) {
        console.log('error at CreateUnitDefinition', error);
        throw error;
    }
};




export const UpdateUnitDefinition = async (data) => {
    // {
    //     "id": 0,
    //     "name": "string",
    //     "code": "string"
    // }

    try {
        const res = await api.put(`UnitDefinition/Update`, data);
        return res.data;
    } catch (error) {
        console.log('error at UpdateUnitDefinition', error);
        throw error;
    }

};
import api from "../axios";

export const GetAllOrders = async (payload, { beginDate, endDate }) => {
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
        const res = await api.post(`Order/GetOrders/${beginDate}/${endDate}`, payload);
        return res.data;
    } catch (error) {
        console.log('error at GetAllOrders', error);
        throw error;
    }
};



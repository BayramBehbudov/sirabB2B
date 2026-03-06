import api from "../axios";


export const CreateMinimumOrderPrice = async (data) => {
    try {
        // {
        //   "orderPrice": 0,
        //   "customerGroupId": 0,
        //   "b2BCustomerId": 0,
        //   "clSpecode": "string",
        //   "clSpecode1": "string",
        //   "clSpecode2": "string",
        //   "clSpecode3": "string",
        //   "clSpecode4": "string",
        //   "clSpecode5": "string",
        //   "b2BCustomerType": "string"
        // }
        const res = await api.post('MinimumOrderPrice/Create', data)
        return res.data
    } catch (error) {
        console.log('error at CreateMinimumOrderPrice', error)
        throw error
    }
}

export const GetAllMinimumOrderPrices = async (payload) => {

    try {
        const res = await api.post('MinimumOrderPrice/GetAllMinimumOrderPrices', payload)
        return res.data
    } catch (error) {
        console.log('error at GetAllMinimumOrderPrices', error)
        throw error
    }
}

export const UpdateMinimumOrderPrice = async (data) => {
    try {
        // {
        //   "id": 0,
        //   "orderPrice": 0,
        //   "customerGroupId": 0,
        //   "b2BCustomerId": 0,
        //   "clSpecode": "string",
        //   "clSpecode1": "string",
        //   "clSpecode2": "string",
        //   "clSpecode3": "string",
        //   "clSpecode4": "string",
        //   "clSpecode5": "string",
        //   "b2BCustomerType": "string"
        // }

        const res = await api.put('MinimumOrderPrice/Update', data)
        return res.data
    } catch (error) {
        console.log('error at UpdateMinimumOrderPrice', error)
        throw error
    }
}


export const DeleteMinimumOrderPrice = async (id) => {
    try {
        const res = await api.put(`MinimumOrderPrice/DeleteMinimumOrderPrice/${id}`)
        return res.data
    } catch (error) {
        console.log('error at DeleteMinimumOrderPrice', error)
        throw error
    }
}

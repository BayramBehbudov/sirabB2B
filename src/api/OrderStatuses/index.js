import api from "../axios";



export const GetAllOrderStatuses = async () => {
    try {
        const res = await api.get('OrderStatus/GetAllOrderStatuses')
        return res.data
    } catch (error) {
        console.log('error at GetAllOrderStatuses', error)
        throw error
    }
}

export const UpdateOrderStatus = async (data) => {
    try {
        // {
        //   "id": 0,
        //   "fileName": "string",
        //   "base64": "string"
        // }
        const res = await api.put('OrderStatus/UpdateOrderStatus', data)
        return res.data
    } catch (error) {
        console.log('error at UpdateOrderStatus', error)
        throw error
    }
}

import api from "../axios";

export const GetAllOrderEvaluationType = async () => {
    try {
        const res = await api.get('OrderEvaluationType/GetAllOrderEvaluationType')
        return res.data
    } catch (error) {
        console.log('error at GetAllOrderEvaluationType', error)
        throw error
    }
}

export const CreateOrderEvaluationType = async (data) => {
    try {
        // {
        //   "name": "string",
        //   "order": 0
        // }
        const res = await api.post('OrderEvaluationType/CreateOrderEvaluationType', data)
        return res.data
    } catch (error) {
        console.log('error at CreateOrderEvaluationType', error)
        throw error
    }
}


export const UpdateOrderEvaluationType = async (data) => {
    try {
        // {
        //   "id": 0,
        //   "name": "string",
        //   "order": 0
        // }

        const res = await api.put('OrderEvaluationType/UpdateOrderEvaluationType', data)
        return res.data
    } catch (error) {
        console.log('error at UpdateOrderEvaluationType', error)
        throw error
    }
}


export const DeleteOrderEvaluationType = async (id) => {
    try {

        const res = await api.put(`OrderEvaluationType/DeleteOrderEvaluationType?id=${id}`)
        return res.data
    } catch (error) {
        console.log('error at DeleteOrderEvaluationType', error)
        throw error
    }
}

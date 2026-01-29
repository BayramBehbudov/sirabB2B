import api from "../axios";


export const CreatePaymentType = async (data) => {
    try {
        // {
        //   "name": "string",
        //   "description": "string",
        //   "fileName": "string",
        //   "base64": "string"
        // }
        const res = await api.post('PaymentType/CreatePaymentType', data)
        return res.data
    } catch (error) {
        console.log('error at CreatePaymentType', error)
        throw error
    }
}

export const GetAllPaymentTypes = async () => {
    try {
        const res = await api.get('PaymentType/GetAllPaymentTypes')
        return res.data
    } catch (error) {
        console.log('error at GetAllPaymentTypes', error)
        throw error
    }
}

export const UpdatePaymentType = async (data) => {
    try {
        // {
        //   "id": 0,
        //   "name": "string",
        //   "description": "string",
        //   "fileName": "string",
        //   "base64": "string"
        // }

        const res = await api.put('PaymentType/UpdatePaymentType', data)
        return res.data
    } catch (error) {
        console.log('error at UpdatePaymentType', error)
        throw error
    }
}

import api from "../axios";


export const CreateContactDetails = async (data) => {
    try {
        // {
        //   "whatsAppNumber": "string",
        //   "callNumber": "string"
        // }
        const res = await api.post('ContactDetails/CreateContactDetails', data)
        return res.data
    } catch (error) {
        console.log('error at CreateContactDetails', error)
        throw error
    }
}

export const GetAllContactDetails = async () => {
    try {
        const res = await api.get('ContactDetails/GetAllContactDetails')
        return res.data
    } catch (error) {
        console.log('error at GetAllContactDetails', error)
        throw error
    }
}

export const UpdateContactDetails = async (data) => {
    try {
        // {
        //   "id": 0,
        //   "whatsAppNumber": "string",
        //   "callNumber": "string"
        // }

        const res = await api.put('ContactDetails/UpdateContactDetails', data)
        return res.data
    } catch (error) {
        console.log('error at UpdateContactDetails', error)
        throw error
    }
}



export const DeleteContactDetails = async (id) => {
    try {
        const res = await api.put(`ContactDetails/DeleteContactDetails?id=${id}`)
        return res.data
    } catch (error) {
        console.log('error at DeleteContactDetails', error)
        throw error
    }
}

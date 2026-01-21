import api from "../axios";

export const CreatePrivacyDocument = async (data) => {
    try {
        // {
        //     "fileName": "string",
        //     "base64": "string"
        //  }
        const res = await api.post('PrivacyDocument/Create', data)
        return res.data
    } catch (error) {
        console.log('error at CreatePrivacyDocument', error)
        throw error
    }
}


// export const UpdatePrivacyDocument = async (data) => {
//     try {
//         // {
//         //     "id": 0,
//         //     "fileName": "string",
//         //     "base64": "string"
//         //  }

//         const res = await api.put('PrivacyDocument/Update', data)
//         return res.data
//     } catch (error) {
//         console.log('error at UpdatePrivacyDocument', error)
//         throw error
//     }
// }




export const GetAllPrivacyDocument = async () => {
    try {
        const res = await api.get('PrivacyDocument/GetAllPrivacyDocuments')
        return res.data
    } catch (error) {
        console.log('error at GetAllPrivacyDocument', error)
        throw error
    }
}

export const DeletePrivacyDocument = async (id) => {
    try {

        const res = await api.put(`PrivacyDocument/DeletePrivacyDocument/${id}`)
        return res.data
    } catch (error) {
        console.log('error at DeletePrivacyDocument', error)
        throw error
    }
}

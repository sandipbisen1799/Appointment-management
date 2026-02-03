import api from "../utils/api.util"

export const getAllAdmin = async ()=>{
    const response = await api.get('/visitor/admin');
    return response.data ;
}
export const getTimeSlot = async (adminName,date)=>{
    const response = await api.get(`/visitor/slots/${adminName}?date2=${date}`);
    return response.data ;
}
export const getServiceSlot = async (adminName)=>{
    const response = await api.get(`/visitor/services/${adminName}`);
    return response.data ;
}


export const submitFormAPI = async ( payload ,adminName)=>{
    const response = await api.post(`/visitor/book/${adminName}`,payload);
    return response.data ;
}




import api from "../utils/api.util";

export const createServiceApi = async (formData)=>{
    const response = await api.post('/admin/createservice',formData)
    return response.data;

}
export const getServiceApi = async ()=>{
    const response = await api.get('/admin/getservice')
    return response.data;
    
}
export const deleteSlotApi = async (id)=>{
    const response = await api.delete(`/admin/deleteslot/${id}`)
    return response.data;
    
}
export const createSlotApi = async (formdata)=>{
    const response = await api.post('/admin/createslot',formdata)
    return response.data;
    
}
export const getdaySlotApi = async (formdata)=>{
    const response = await api.post('/admin/getdayslot',formdata)
    return response.data;
    
}
export const getSlotApi = async ()=>{
    const response = await api.get('/admin/getslots')
    return response.data;
    
}

export const updateSlotApi = async (id, formdata)=>{
    const response = await api.put(`/admin/updateslot/${id}`,formdata)
    return response.data;
    
}
export const getAllAppointmentsApi = async ()=>{
    const response = await api.get('/admin/appointments')
    return response.data;   
}
export const approveAppointmentsApi = async (appointmentId)=>{
    const response = await api.put(`/admin/approve-appointment/${appointmentId}`)
    return response.data;   
}
export const rejectAppointmentsApi = async (appointmentId)=>{
    const response = await api.put(`/admin/reject-appointment/${appointmentId}`)
    return response.data;   
}
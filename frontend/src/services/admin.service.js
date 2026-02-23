import api from "../utils/api.util";

export const createServiceApi = async (formData)=>{
    const response = await api.post('/admin/createservice',formData)
    return response.data;

}
export const getServiceApi = async ()=>{
    const response = await api.get('/admin/getservice')
    return response.data;
    
}
export const deleteServiceAPI = async (id)=>{
    const response = await api.delete(`/admin/service/${id}`)
    return response.data;
    
}
export const updateServiceAPI = async (id ,formData)=>{
    const response = await api.put(`/admin/service/${id}`, formData) ;

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
export const getAllAppointmentsApi = async (email = null)=>{
    const params = email ? { email } : {};
    const response = await api.get('/admin/appointments', { params })
    return response.data;   
}
export const getApproveAppointmentsApi = async (email = null)=>{
    const params = email ? { email } : {};
    const response = await api.get('/admin/approveappointments', { params })
    return response.data;   
}
export const getnewlyAppointmentsApi = async ()=>{
    const response = await api.get('/admin/appointment')
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
export const getOrderAPI = async ()=>{
    const response = await api.get(`/admin/getorder`)
    return response.data;   
}
export const sendAllEmailApi = async ({ emails, message, subject })=>{
    const response = await api.post('/admin/send-all-email', { emails, message, subject })
    return response.data;
}
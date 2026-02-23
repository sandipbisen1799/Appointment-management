import api from "../utils/api.util";
export const createOrderAPI = async ( amount)=>{
    const response = await api.post(`/payment/create-order` , amount);
    return response.data ;
}

export const handlePaymentFailureAPI = async (paymentData) => {
    const response = await api.post(`/payment/failed`, paymentData);
    return response.data;
}
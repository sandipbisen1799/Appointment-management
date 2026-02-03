import api from "../utils/api.util.js";

export const signupApi = async (formData) => {
  const response = await api.post('/auth/register', formData);
  return response.data;
}

export const loginApi = async (formData) => {
  const response = await api.post('/auth/login', formData);
  return response.data;
}

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
}

export const fetchMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
}
export const addAdminAPI = async (formData) => {
  const response = await api.post('/auth/create',formData);
  return response.data;
}
export const fetchAdminAPI = async () => {
  const response = await api.get('/auth/admin');
  return response.data;
}
export const blockAdminAPI = async (id) => {
  const response = await api.put(`/auth/block/${id}`);
  return response.data;
}
export const unblockAdminAPI = async (id) => {
  const response = await api.put(`/auth/unblock/${id}`);
  return response.data;
}
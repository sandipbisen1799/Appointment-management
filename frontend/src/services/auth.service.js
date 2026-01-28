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
import Axios from 'axios';

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shopease-riot.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;



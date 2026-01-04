import Axios from 'axios';

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shopease-riot.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized error, clear the token and redirect to login
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Only clear and redirect if not already on login/signup page
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;



import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or whatever key you're using
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

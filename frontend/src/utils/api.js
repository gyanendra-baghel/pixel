// src/api/axiosInstance.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
          refresh: localStorage.getItem('refreshToken'),
        });

        const { access } = res.data;
        localStorage.setItem('accessToken', access);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // localStorage.clear(); // clear tokens
        // window.location.href = '/login'; // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

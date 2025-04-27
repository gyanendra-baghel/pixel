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

// Response Interceptor: Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code (401, 403, etc.)
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.clear();
        window.location.href = '/signin';
      }
    } else if (error.request) {
      // No response received - likely a Network Error
      console.error('Network error: Backend server might be down.');
      alert('Oops! Cannot connect to the server. Please try again later.');

    } else {
      // Something else happened setting up the request
      console.error('Error', error.message);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;

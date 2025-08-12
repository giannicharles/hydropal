import axios from 'axios';

// Determine API URL based on environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'   // For browser access
  : import.meta.env.VITE_API_URL; // For Docker container access

console.log(`Using API URL: ${baseURL}`);

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Request Error:', error.request);
    } else {
      // Other errors
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

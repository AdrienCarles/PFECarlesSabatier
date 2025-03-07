import axios from "axios";

// Base configuration for axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token refresh or other error scenarios
    return Promise.reject(error);
  }
);

export default axiosInstance;

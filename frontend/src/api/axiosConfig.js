import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    const publicPaths = ['/welcome', '/login'];
    
    const isPublicPage = publicPaths.some(path => 
      window.location.pathname.toLowerCase().includes(path.toLowerCase())
    );
    
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !isPublicPage &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      
      try {
        await axios.post(process.env.REACT_APP_API_URL + '/api/auth/refresh-token', {}, { withCredentials: true });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Échec du rafraîchissement", refreshError);
        if (!isPublicPage) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

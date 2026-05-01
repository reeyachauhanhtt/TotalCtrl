import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;

import axios from "axios";

// Create a preconfigured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("animatica_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

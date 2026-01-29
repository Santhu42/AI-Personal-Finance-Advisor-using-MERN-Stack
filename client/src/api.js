import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-personal-finance-advisor-using-mern-usuh.onrender.com",
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

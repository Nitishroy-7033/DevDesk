import axios from "axios";

// Base URL of your backend
const BASE_URL = "http://localhost:5175";

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Token parse error:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

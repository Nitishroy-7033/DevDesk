import axios from "axios";
import config from "@/config";

// Create Axios instance
const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (requestConfig) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      if (config.enableLogging) {
        console.error("Token parse error:", err);
      }
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  async login(credentials) {
    try {
      const response = await apiClient.post(config.endpoints.auth.login, {
        phone: credentials.phone.trim(),
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async signup(userData) {
    try {
      const response = await apiClient.post(config.endpoints.user.register, {
        name: userData.name.trim(),
        phone: userData.phone.trim(),
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async logout() {
    try {
      // Clear local storage
      Object.values(config.storageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });
      return { success: true };
    } catch (error) {
      throw new Error("Logout failed");
    }
  },

  async getCurrentUser() {
    try {
      const userId = localStorage.getItem(config.storageKeys.userId);
      if (!userId) return null;

      const response = await apiClient.get(
        `${config.endpoints.user.profile}/${userId}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default apiClient;

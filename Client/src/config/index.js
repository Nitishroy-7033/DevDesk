// Configuration file for environment variables and constants

const config = {
  // API Configuration
  apiUrl:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === "production"
      ? "https://devworkbench.onrender.com/api"
      : "http://localhost:5175"),
  appName: import.meta.env.VITE_APP_NAME || "ZappyTasks",

  // Environment
  isDevelopment: import.meta.env.MODE === "development",
  isProduction: import.meta.env.MODE === "production",

  // Features
  enableLogging:
    import.meta.env.VITE_ENABLE_LOGGING === "true" ||
    import.meta.env.MODE === "development",

  // API Endpoints
  endpoints: {
    auth: {
      login: "/Auth/login",
      logout: "/Auth/logout",
    },
    user: {
      register: "/User/register",
      profile: "/User",
      preferences: "/User/{id}/preferences",
      stats: "/User/{id}/stats",
    },
    task: {
      base: "/Task",
      execute: "/Task/execute",
      history: "/Task/history",
    },
  },

  // Local Storage Keys
  storageKeys: {
    token: "token",
    userId: "userId",
    userName: "userName",
    userPhone: "userPhone",
    userRole: "userRole",
    isVerified: "isVerified",
    expireAt: "expireAt",
    tokenType: "tokenType",
  },

  // Validation
  validation: {
    phoneRegex: /^\d{10}$/,
    minPasswordLength: 6,
  },

  // UI Constants
  ui: {
    toastDuration: 3000,
    debounceDelay: 300,
  },

  // Routes
  routes: {
    home: "/home",
    login: "/login",
    manageTasks: "/manage-tasks",
    progress: "/progress",
  },
};

export default config;

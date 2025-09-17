import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "@/lib/ApiClient";
import config from "@/config";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(config.storageKeys.token);
    if (token) {
      const userObj = {
        token,
        userId: localStorage.getItem(config.storageKeys.userId),
        userName: localStorage.getItem(config.storageKeys.userName),
        userPhone: localStorage.getItem(config.storageKeys.userPhone),
        userRole: localStorage.getItem(config.storageKeys.userRole),
        isVerified:
          localStorage.getItem(config.storageKeys.isVerified) === "true",
        expireAt: localStorage.getItem(config.storageKeys.expireAt),
        tokenType: localStorage.getItem(config.storageKeys.tokenType),
      };
      setUser(userObj);
    }
    setIsLoading(false);
  }, []);

  const login = (data) => {
    // Save in localStorage
    localStorage.setItem(config.storageKeys.token, data.token);
    localStorage.setItem(config.storageKeys.userId, data.userId);
    localStorage.setItem(config.storageKeys.userName, data.userName);
    localStorage.setItem(config.storageKeys.userPhone, data.userPhone);
    localStorage.setItem(config.storageKeys.userRole, data.userRole);
    localStorage.setItem(config.storageKeys.isVerified, data.isVerified);
    localStorage.setItem(config.storageKeys.expireAt, data.expireAt);
    localStorage.setItem(config.storageKeys.tokenType, data.tokenType);

    setUser(data);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      Object.values(config.storageKeys).forEach((key) =>
        localStorage.removeItem(key)
      );
      setUser(null);
    }
  };

  const getCurrentUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      return userData;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  };

  const isLoggedIn = !!user;

  const value = {
    user,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

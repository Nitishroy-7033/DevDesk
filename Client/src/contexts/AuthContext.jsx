import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

const LOCAL_STORAGE_KEYS = {
  token: "token",
  userId: "userId",
  userName: "userName",
  userPhone: "userPhone",
  userRole: "userRole",
  isVerified: "isVerified",
  expireAt: "expireAt",
  tokenType: "tokenType",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.token);
    if (token) {
      const userObj = {
        token,
        userId: localStorage.getItem(LOCAL_STORAGE_KEYS.userId),
        userName: localStorage.getItem(LOCAL_STORAGE_KEYS.userName),
        userPhone: localStorage.getItem(LOCAL_STORAGE_KEYS.userPhone),
        userRole: localStorage.getItem(LOCAL_STORAGE_KEYS.userRole),
        isVerified:
          localStorage.getItem(LOCAL_STORAGE_KEYS.isVerified) === "true",
        expireAt: localStorage.getItem(LOCAL_STORAGE_KEYS.expireAt),
        tokenType: localStorage.getItem(LOCAL_STORAGE_KEYS.tokenType),
      };
      setUser(userObj);
    }
  }, []);

  const login = (data) => {
    // Save in localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.token, data.token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.userId, data.userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.userName, data.userName);
    localStorage.setItem(LOCAL_STORAGE_KEYS.userPhone, data.userPhone);
    localStorage.setItem(LOCAL_STORAGE_KEYS.userRole, data.userRole);
    localStorage.setItem(LOCAL_STORAGE_KEYS.isVerified, data.isVerified);
    localStorage.setItem(LOCAL_STORAGE_KEYS.expireAt, data.expireAt);
    localStorage.setItem(LOCAL_STORAGE_KEYS.tokenType, data.tokenType);

    setUser(data);
  };

  const logout = () => {
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) =>
      localStorage.removeItem(key)
    );
    setUser(null);
  };

  const isLoggedIn = !!user;

  const value = {
    user,
    login,
    logout,
    isLoggedIn,
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

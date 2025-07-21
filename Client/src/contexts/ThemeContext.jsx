import { createContext, useContext, useEffect, useState } from "react";

export const themeColors = {
  light: {
    bgColor: "#ffffff",
    cardBg: "#f9f9f9",
    borderColor: "#ddd",
    textColor: "#222222",
    secondaryTextColor: "#666666",
    mutedTextColor: "#999999",
    accentColor: "#007bff",
    successColor: "#28a745",
    pendingColor: "#6c757d",
    hoverBg: "#f5f5f5",
    activeBg: "#e6f0ff",
    completedBg: "#e9f7ef",
  },
  dark: {
    bgColor: "#1e1e1e",
    cardBg: "#2f2f2f", // ← your darkBGColor
    borderColor: "#444444",
    textColor: "#ffffff",
    secondaryTextColor: "#cccccc",
    mutedTextColor: "#888888",
    accentColor: "#00aaff",
    successColor: "#28a745",
    pendingColor: "#6c757d",
    hoverBg: "#383838",
    activeBg: "#1f2b3a",
    completedBg: "#1e2e22",
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // ✅ Define toggleTheme
  
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const currentColors = themeColors[theme];

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    Object.entries(currentColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem("theme", theme);
  }, [theme]);

  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

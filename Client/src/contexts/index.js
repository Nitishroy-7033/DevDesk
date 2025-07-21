// context/index.js
import { AuthProvider } from "./AuthContext";
import { TodoProvider } from "./TodoContext";
import { ThemeProvider } from "./ThemeContext";

// Wrap all providers here
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TodoProvider>{children}</TodoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

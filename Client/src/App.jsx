import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/pages/Auth/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TodoProvider } from "@/contexts/TodoContext";
import { ActiveTaskProvider } from "@/contexts/ActiveTaskContext";
import Home from "./pages/Home/Home";
import Index from "./pages/Index";
import ManageTasks from "./pages/ManageTask/ManageTasks";
import Progress from "./pages/Progress/Progress";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TodoProvider>
          <ActiveTaskProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/manage-tasks" element={<ManageTasks />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ActiveTaskProvider>
        </TodoProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

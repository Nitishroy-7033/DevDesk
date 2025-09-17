import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/pages/Auth/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect once auth state is determined
    if (!isLoading) {
      // Always redirect to home - authentication is now optional
      navigate("/home");
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to TaskManager</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null; // This should never render as the effect will redirect
};

export default Index;

import { useAuth } from "@/pages/Auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, LogIn } from "lucide-react";

export const DemoModeBanner = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Don't show banner if user is logged in
  if (isLoggedIn) {
    return null;
  }

  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 mb-4">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-blue-800 dark:text-blue-200">
          You're using demo mode. Your tasks won't be saved.{" "}
          <strong>Login to save your progress!</strong>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/login")}
          className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </AlertDescription>
    </Alert>
  );
};

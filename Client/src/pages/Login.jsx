import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import "./Login.css"; // <-- Create and import your custom CSS file
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await handleSignup();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5175/Auth/login",
        {
          phone: phone,
          password: password,
        }
      );

      const data = response.data;
      // Save login
      login(data);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.userName}`,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.userName);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userPhone", data.userPhone);
      localStorage.setItem("expireAt", data.expireAt);
      localStorage.setItem("tokenType", data.tokenType);
      localStorage.setItem("userRole", data.userRole);

      navigate("/");
    } catch (err) {
      console.log(err.response.data.message);
      toast({
        title: "Login failed",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };
  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5175/User/register", {
        name: name, // You can also bind this to state
        phone: phone,
        passowrd: password, // note: spelling matches API ("passowrd")
      });

      toast({
        title: "Account created",
        description: "You can now sign in with your credentials.",
      });

      setIsSignUp(false); // Switch back to login form
    } catch (err) {
      console.log(err);
      toast({
        title: "Signup failed",
        description: err.response?.data?.message || "Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-back-link">
          <Link to="/" className="back-link">
            <ArrowLeft className="icon" />
            Back to Study Planner
          </Link>
        </div>

        <Card>
          <CardHeader className="login-header">
            <div className="logo-circle">
              <span className="logo-text">SP</span>
            </div>
            <CardTitle className="login-title">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <p className="login-subtitle">
              {isSignUp
                ? "Start your study journey today"
                : "Sign in to continue your study journey"}
            </p>
          </CardHeader>

          <CardContent className="login-content">
            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="form-input"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="Phone"
                  placeholder="Enter your Phone Number"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="password">Password</Label>
                <div className="password-wrapper">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="icon-small" />
                    ) : (
                      <Eye className="icon-small" />
                    )}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div className="form-group">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="form-input"
                  />
                </div>
              )}

              <Button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading
                  ? "Signing In..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            <div className="separator-wrapper">
              <Separator />
              <span className="separator-text">OR</span>
            </div>

            <div className="switch-text">
              <span>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
              <Button
                variant="link"
                className="switch-link"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

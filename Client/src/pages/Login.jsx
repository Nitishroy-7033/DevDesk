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
import { authAPI } from "@/lib/ApiClient";
import config from "@/config";
import "./Login.css";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!config.validation.phoneRegex.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < config.validation.minPasswordLength) {
      newErrors.password = `Password must be at least ${config.validation.minPasswordLength} characters`;
    }

    // Name validation for signup
    if (isSignUp && !name.trim()) {
      newErrors.name = "Full name is required";
    }

    // Confirm password validation for signup
    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await handleSignup();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.error("Authentication error:", error);
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
      const data = await authAPI.login({
        phone: phone,
        password: password,
      });

      // Save login using AuthContext
      login(data);

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.userName}`,
      });

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const handleSignup = async () => {
    try {
      await authAPI.register({
        name: name,
        phone: phone,
        password: password,
      });

      toast({
        title: "Account created",
        description: "You can now sign in with your credentials.",
      });

      setIsSignUp(false);
      // Clear form
      setName("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message,
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="form-group">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your Phone Number"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {isSignUp && (
                <div className="form-group">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading
                  ? isSignUp
                    ? "Creating Account..."
                    : "Signing In..."
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
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setPhone("");
                  setPassword("");
                  setName("");
                  setConfirmPassword("");
                }}
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

import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/pages/Auth/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import config from "@/config";
import { authReducer, initialState } from "./states/Reducer";
import * as actionTypes from "./states/Types";
import { handleLogin, handleSignup } from "./states/Actions";
import AuthHeader from "./components/AuthHeader";
import AuthForm from "./components/AuthForm";
import AuthFooter from "./components/AuthFooter";
import { Row } from "antd";
import "./Login.css";

export const Login = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { isSignUp, phone, password, name, confirmPassword } = state;

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!config.validation.phoneRegex.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < config.validation.minPasswordLength) {
      newErrors.password = `Password must be at least ${config.validation.minPasswordLength} characters long`;
    }

    if (isSignUp && !name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    dispatch({ type: actionTypes.SET_ERRORS, payload: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSignUp) {
      handleSignup(dispatch, name, phone, password, login, navigate, toast);
    } else {
      handleLogin(dispatch, phone, password, login, navigate, toast);
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: actionTypes.SET_FIELD, payload: { field, value } });
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-back-link">
          <Link to="/" className="back-link">
            <ArrowLeft className="icon" />
            Back to HomePage
          </Link>
        </div>

        <Card>
          <AuthHeader isSignUp={isSignUp} />
          <CardContent className="login-content">
            <AuthForm
              state={state}
              dispatch={dispatch}
              handleSubmit={handleSubmit}
              handleFieldChange={handleFieldChange}
            />
            <AuthFooter isSignUp={isSignUp} dispatch={dispatch} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

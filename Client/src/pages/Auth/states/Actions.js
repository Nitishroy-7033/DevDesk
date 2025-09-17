import { authAPI } from "@/lib/ApiClient";
import { SET_LOADING, SET_ERRORS } from "./Types";
import config from "@/config";

export const handleLogin = async (
  dispatch,
  phone,
  password,
  login,
  navigate,
  toast
) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const data = await authAPI.login({ phone, password });
    login(data);
    toast({
      title: "Success",
      description: "Logged in successfully!",
    });
    navigate(config.routes.manageTasks);
  } catch (error) {
    console.error("Authentication error:", error);
    dispatch({ type: SET_ERRORS, payload: { general: "Invalid credentials" } });
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const handleSignup = async (
  dispatch,
  name,
  phone,
  password,
  login,
  navigate,
  toast
) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await authAPI.signup({
      name,
      phone,
      password,
    });
    // After successful signup, log the user in
    const data = await authAPI.login({ phone, password });
    login(data);
    toast({
      title: "Success",
      description: "Account created successfully!",
    });
    navigate(config.routes.manageTasks);
  } catch (error) {
    console.error("Authentication error:", error);
    dispatch({
      type: SET_ERRORS,
      payload: { general: "Could not create account" },
    });
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

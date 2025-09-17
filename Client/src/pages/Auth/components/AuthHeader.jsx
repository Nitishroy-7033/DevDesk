import { CardHeader, CardTitle } from "@/components/ui/card";

const AuthHeader = ({ isSignUp }) => (
  <CardHeader className="login-header">
    <div className="logo-circle">
      <span className="logo-text">HP</span>
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
);

export default AuthHeader;

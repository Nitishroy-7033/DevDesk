import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import * as actionTypes from "../states/Types";

const AuthForm = ({ state, dispatch, handleSubmit, handleFieldChange }) => {
  const {
    isSignUp,
    name,
    phone,
    password,
    confirmPassword,
    showPassword,
    errors,
    isLoading,
  } = state;

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {isSignUp && (
        <div className="form-group">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            className="form-input"
            value={name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
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
          onChange={(e) => handleFieldChange("phone", e.target.value)}
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
            onChange={(e) => handleFieldChange("password", e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            className="toggle-password-btn"
            onClick={() => dispatch({ type: actionTypes.SET_SHOW_PASSWORD })}
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
            onChange={(e) =>
              handleFieldChange("confirmPassword", e.target.value)
            }
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
  );
};

export default AuthForm;

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as actionTypes from "../states/Types";

const AuthFooter = ({ isSignUp, dispatch }) => (
  <>
    <div className="separator-wrapper">
      <Separator />
      <span className="separator-text">OR</span>
    </div>
    <div className="switch-text">
      <span>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
      </span>
      <Button
        variant="link"
        className="switch-link"
        onClick={() => dispatch({ type: actionTypes.SET_IS_SIGN_UP })}
      >
        {isSignUp ? "Sign in" : "Sign up"}
      </Button>
    </div>
  </>
);

export default AuthFooter;

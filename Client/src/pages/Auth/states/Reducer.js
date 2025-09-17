import * as actionTypes from "./Types";

export const initialState = {
  showPassword: false,
  isSignUp: false,
  phone: "",
  password: "",
  name: "",
  confirmPassword: "",
  isLoading: false,
  errors: {},
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_FIELD:
      return { ...state, [action.payload.field]: action.payload.value };
    case actionTypes.SET_SHOW_PASSWORD:
      return { ...state, showPassword: !state.showPassword };
    case actionTypes.SET_IS_SIGN_UP:
      return {
        ...initialState,
        isSignUp: !state.isSignUp,
      };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_ERRORS:
      return { ...state, errors: action.payload };
    case actionTypes.RESET_FORM:
      return {
        ...state,
        phone: "",
        password: "",
        name: "",
        confirmPassword: "",
        errors: {},
      };
    default:
      return state;
  }
};

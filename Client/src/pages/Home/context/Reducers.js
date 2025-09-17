import * as actionTypes from "./Types";

export const initialState = {
  isFullscreen: false,
  loading: false,
  error: null,
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_FULLSCREEN:
      return { ...state, isFullscreen: !state.isFullscreen };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

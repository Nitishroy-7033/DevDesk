import * as actionTypes from "./Types";

export const toggleFullscreen = (dispatch) => {
  dispatch({ type: actionTypes.TOGGLE_FULLSCREEN });
};

export const setLoading = (dispatch, loading) => {
  dispatch({ type: actionTypes.SET_LOADING, payload: loading });
};

export const setError = (dispatch, error) => {
  dispatch({ type: actionTypes.SET_ERROR, payload: error });
};

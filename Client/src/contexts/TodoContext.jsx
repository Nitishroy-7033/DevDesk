import { createContext, useContext, useReducer, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

const TodoContext = createContext(undefined);

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_TASKS: "SET_TASKS",
  ADD_TASK: "ADD_TASK",
  SET_ERROR: "SET_ERROR",
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case actionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      };

    case actionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const fetchTasksForUserAsync = async (date) => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      // Use today's date in YYYY-MM-DD format if not passed
      const today = new Date().toISOString().split("T")[0];
      console.log("Get Todo");

      const response = await axios.get(
        `http://localhost:5175/Task/upcoming-task?date=${today}`
      );
      console.log(response);
      console.log("Get Todo");
      if (response && response.data) {
        dispatch({ type: actionTypes.SET_TASKS, payload: response.data });
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: "No tasks found." });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to fetch tasks",
      });
    }
  };

  const value = {
    // State
    tasks: state.tasks,
    users: state.users,
    loading: state.loading,
    error: state.error,
    fetchTasksForUserAsync,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

export { actionTypes };

import { createContext, useContext, useReducer, useEffect } from "react";
import { taskAPI } from "@/lib/api";
import config from "@/config";

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
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
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

    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case actionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
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

  const fetchTasksForUserAsync = async (date, statusFilter = "All") => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const userId = localStorage.getItem(config.storageKeys.userId);
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Use provided date or today's date in YYYY-MM-DD format
      const targetDate = date || new Date().toISOString().split("T")[0];

      if (config.enableLogging) {
        console.log("Fetching tasks for date:", targetDate, "with status filter:", statusFilter);
      }

      // Get upcoming tasks with status filter
      const tasks = await taskAPI.getUpcomingTasks(targetDate, statusFilter);
      dispatch({ type: actionTypes.SET_TASKS, payload: tasks || [] });
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error fetching tasks:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to fetch tasks",
      });
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const newTask = await taskAPI.createTask(taskData);
      dispatch({ type: actionTypes.ADD_TASK, payload: newTask });

      return newTask;
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error creating task:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to create task",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const updatedTask = await taskAPI.updateTask(taskId, updates);
      dispatch({ type: actionTypes.UPDATE_TASK, payload: updatedTask });

      return updatedTask;
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error updating task:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to update task",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      await taskAPI.deleteTask(taskId);
      dispatch({ type: actionTypes.DELETE_TASK, payload: taskId });
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error deleting task:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to delete task",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const executeTask = async (taskData) => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const result = await taskAPI.executeTask(taskData);

      // Optionally refresh tasks after execution
      await fetchTasksForUserAsync();

      return result;
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error executing task:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to execute task",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTaskHistory = async () => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const userId = localStorage.getItem(config.storageKeys.userId);
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const history = await taskAPI.getTaskHistory(userId);
      return history;
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error fetching task history:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to fetch task history",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const value = {
    // State
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,

    // Actions
    fetchTasksForUserAsync,
    createTask,
    updateTask,
    deleteTask,
    executeTask,
    getTaskHistory,
    clearError,
    setLoading,
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

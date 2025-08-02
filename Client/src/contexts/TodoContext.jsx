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

// Demo tasks for non-logged-in users
const demoTasks = [
  {
    id: "task-001",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "Review AI Algorithms",
    description:
      "Go through core ML algorithms like SVM, KNN, and Decision Trees.",
    startTime: "09:00:00 PM",
    endTime: "10:15:00 PM",
    expectedDurationMinutes: 75,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#2196F3",
    iconName: "📘",
    priority: "High",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:20:00+05:30",
    updatedAt: "2025-08-02T23:20:00+05:30",
  },
  {
    id: "task-002",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "Practice Prompt Engineering",
    description: "Try 3 new prompt formats for GPT.",
    startTime: "08:00:00 PM",
    endTime: "09:00:00 PM",
    expectedDurationMinutes: 60,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#FF9800",
    iconName: "💬",
    priority: "Medium",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:21:00+05:30",
    updatedAt: "2025-08-02T23:21:00+05:30",
  },
  {
    id: "task-003",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "LangChain Hands-on",
    description: "Build a mini app with LangChain and OpenAI.",
    startTime: "07:00:00 PM",
    endTime: "08:30:00 PM",
    expectedDurationMinutes: 90,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#9C27B0",
    iconName: "🧠",
    priority: "High",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:22:00+05:30",
    updatedAt: "2025-08-02T23:22:00+05:30",
  },
  {
    id: "task-004",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "Summarize AI Notes",
    description: "Write concise summaries of previous study sessions.",
    startTime: "06:00:00 PM",
    endTime: "06:45:00 PM",
    expectedDurationMinutes: 45,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#00BCD4",
    iconName: "📝",
    priority: "Medium",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:23:00+05:30",
    updatedAt: "2025-08-02T23:23:00+05:30",
  },
  {
    id: "task-005",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "Explore Hugging Face",
    description: "Look into Transformers library & example projects.",
    startTime: "05:00:00 PM",
    endTime: "06:30:00 PM",
    expectedDurationMinutes: 90,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#E91E63",
    iconName: "🤗",
    priority: "Low",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:24:00+05:30",
    updatedAt: "2025-08-02T23:24:00+05:30",
  },
  {
    id: "task-006",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "Experiment with Colab",
    description: "Run AI models on Google Colab using small datasets.",
    startTime: "04:00:00 PM",
    endTime: "05:00:00 PM",
    expectedDurationMinutes: 60,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#FFC107",
    iconName: "🔬",
    priority: "Low",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:25:00+05:30",
    updatedAt: "2025-08-02T23:25:00+05:30",
  },
  {
    id: "task-007",
    userId: "687a84b9bb4c3c353ad24be9",
    title: "Quiz on GenAI Basics",
    description: "Test yourself on key concepts of Generative AI.",
    startTime: "03:00:00 PM",
    endTime: "03:45:00 PM",
    expectedDurationMinutes: 45,
    repeatCycleType: "daily",
    customRepeatDays: [],
    fromDate: "2025-08-02T00:00:00+05:30",
    toDate: "2025-08-29T00:00:00+05:30",
    colorHex: "#607D8B",
    iconName: "🧪",
    priority: "Medium",
    isActive: true,
    isTemplate: false,
    tags: [],
    category: null,
    enableReminders: true,
    reminderMinutesBefore: 15,
    totalCompletions: 0,
    totalSkips: 0,
    averageCompletionTime: 0,
    completionRate: 0,
    createdAt: "2025-08-02T23:26:00+05:30",
    updatedAt: "2025-08-02T23:26:00+05:30",
  },
];

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

  const fetchTasksForUserAsync = async (date, statusFilter = "Pending") => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const userId = localStorage.getItem(config.storageKeys.userId);

      // If user is not logged in, show demo tasks
      if (!userId) {
        if (config.enableLogging) {
          console.log("User not logged in, showing demo tasks");
        }

        // Simulate loading delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch({ type: actionTypes.SET_TASKS, payload: demoTasks });
        return;
      }

      // Use provided date or today's date in YYYY-MM-DD format
      const targetDate = date || new Date().toISOString().split("T")[0];

      if (config.enableLogging) {
        console.log(
          "Fetching tasks for date:",
          targetDate,
          "with status filter:",
          statusFilter
        );
      }

      // Get upcoming tasks with status filter for logged-in users
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

      const userId = localStorage.getItem(config.storageKeys.userId);

      // If user is not logged in, show message to login
      if (!userId) {
        throw new Error("Please login to create tasks. This is demo mode!");
      }

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

  const completeTask = async (taskData) => {
    try {
      setLoading(true);
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const userId = localStorage.getItem(config.storageKeys.userId);

      // If user is not logged in, simulate completion for demo
      if (!userId) {
        if (config.enableLogging) {
          console.log("Demo mode: Simulating task completion");
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Update demo task status locally
        const updatedTask = { ...taskData, status: "completed" };
        dispatch({ type: actionTypes.UPDATE_TASK, payload: updatedTask });

        return { success: true, message: "Demo task completed!" };
      }

      // For logged-in users, use real API
      const result = await taskAPI.completeTask(taskData);

      // Refresh tasks after completion
      await fetchTasksForUserAsync();

      return result;
    } catch (error) {
      if (config.enableLogging) {
        console.error("Error completing task:", error);
      }
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message || "Failed to complete task",
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
    completeTask,
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

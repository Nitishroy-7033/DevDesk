import apiClient from "@/lib/ApiClient";
import * as actionTypes from "./Types";

// Action creators for form field updates
export const setTitle = (dispatch, title) => {
  dispatch({
    type: actionTypes.SET_TITLE,
    payload: title,
  });
};

export const setDescription = (dispatch, description) => {
  dispatch({
    type: actionTypes.SET_DESCRIPTION,
    payload: description,
  });
};

export const setStartTime = (dispatch, time) => {
  dispatch({
    type: actionTypes.SET_START_TIME,
    payload: time,
  });
};

export const setEndTime = (dispatch, time) => {
  dispatch({
    type: actionTypes.SET_END_TIME,
    payload: time,
  });
};

export const setStartDate = (dispatch, date) => {
  dispatch({
    type: actionTypes.SET_START_DATE,
    payload: date,
  });
};

export const setEndDate = (dispatch, date) => {
  dispatch({
    type: actionTypes.SET_END_DATE,
    payload: date,
  });
};

export const setIcon = (dispatch, icon) => {
  dispatch({
    type: actionTypes.SET_ICON,
    payload: icon,
  });
};

export const setRepeatType = (dispatch, type) => {
  dispatch({
    type: actionTypes.SET_REPEAT_TYPE,
    payload: type,
  });
};

export const setRepeatDays = (dispatch, days) => {
  dispatch({
    type: actionTypes.SET_REPEAT_DAYS,
    payload: days,
  });
};

export const setTaskData = (dispatch, taskData) => {
  dispatch({
    type: actionTypes.SET_TASK_DATA,
    payload: taskData,
  });
};

export const resetForm = (dispatch) => {
  dispatch({
    type: actionTypes.RESET_FORM,
  });
};

// Validation functions
export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return { isValid: true, message: "" };

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMs = end - start;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMs <= 0) {
    return { isValid: false, message: "End time must be after start time" };
  }

  if (diffInMinutes < 5) {
    return {
      isValid: false,
      message: "Task duration must be at least 5 minutes",
    };
  }

  return { isValid: true, message: "" };
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return { isValid: true, message: "" };

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return {
      isValid: false,
      message: "End date cannot be before start date",
    };
  }

  return { isValid: true, message: "" };
};

export const validateForm = (state) => {
  const errors = {};

  // Validate title
  if (!state.title.trim()) {
    errors.title = "Please enter a task title.";
  }

  // Validate time range
  const timeValidation = validateTimeRange(state.startTime, state.endTime);
  if (!timeValidation.isValid) {
    errors.timeRange = timeValidation.message;
  }

  // Validate date range
  const dateValidation = validateDateRange(state.startDate, state.endDate);
  if (!dateValidation.isValid) {
    errors.dateRange = dateValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper function to format time to "8:15:00 PM" format
const formatTimeString = (date) => {
  if (!date) return null;

  const timeDate = new Date(date);
  return timeDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// API actions
export const createTask = async (dispatch, state, toast, onSuccess) => {
  try {
    dispatch({ type: actionTypes.CREATE_TASK_START });

    // Validate form
    const validation = validateForm(state);
    if (!validation.isValid) {
      dispatch({
        type: actionTypes.SET_VALIDATION_ERRORS,
        payload: validation.errors,
      });

      // Show first error in toast
      const firstError = Object.values(validation.errors)[0];
      toast({
        title: "Error",
        description: firstError,
        variant: "destructive",
      });

      dispatch({ type: actionTypes.CREATE_TASK_ERROR, payload: firstError });
      return;
    }

    // Get user ID
    const userId = localStorage.getItem("userId");
    if (!userId) {
      const errorMsg = "User ID not found. Please login again.";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      dispatch({ type: actionTypes.CREATE_TASK_ERROR, payload: errorMsg });
      return;
    }

    // Format the task data
    const taskData = {
      userId,
      title: state.title.trim(),
      description: state.description.trim(),
      startTime: formatTimeString(state.startTime),
      endTime: formatTimeString(state.endTime),
      startDate: state.startDate
        ? new Date(state.startDate).toISOString().split("T")[0]
        : null,
      endDate: state.endDate
        ? new Date(state.endDate).toISOString().split("T")[0]
        : null,
      iconName: state.icon || "📝",
      repeatType: state.repeatType || "daily",
      repeatDays: state.repeatDays || [],
      status: "pending",
    };

    // Debug: Log the formatted task data
    console.log("Task data being sent:", taskData);

    // Make API call
    const response = await apiClient.post("/Task", taskData);

    if (response.status === 200 || response.status === 201) {
      dispatch({ type: actionTypes.CREATE_TASK_SUCCESS });

      toast({
        title: "Success",
        description: "Task created successfully!",
        variant: "default",
      });

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error("Error creating task:", error);

    const errorMsg =
      error.response?.data?.message || error.message || "Failed to create task";

    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });

    dispatch({ type: actionTypes.CREATE_TASK_ERROR, payload: errorMsg });
  }
};

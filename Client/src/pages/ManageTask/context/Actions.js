import { taskAPI } from "@/lib/api";
import * as actionTypes from "./Types";

// Action creators for setting state
export const setSelectedDate = (dispatch, date) => {
  dispatch({
    type: actionTypes.SET_SELECTED_DATE,
    payload: date,
  });
};

export const setActiveView = (dispatch, view) => {
  dispatch({
    type: actionTypes.SET_ACTIVE_VIEW,
    payload: view,
  });
};

export const setSelectedTask = (dispatch, task) => {
  dispatch({
    type: actionTypes.SET_SELECTED_TASK,
    payload: task,
  });
};

export const setModalVisible = (dispatch, visible) => {
  dispatch({
    type: actionTypes.SET_MODAL_VISIBLE,
    payload: visible,
  });
};

export const setAddTaskOpen = (dispatch, open) => {
  dispatch({
    type: actionTypes.SET_ADD_TASK_OPEN,
    payload: open,
  });
};

// Async actions for API calls
export const fetchTasks = async (dispatch) => {
  try {
    dispatch({ type: actionTypes.FETCH_TASKS_START });
    const tasks = await taskAPI.getTasks();
    dispatch({
      type: actionTypes.FETCH_TASKS_SUCCESS,
      payload: tasks,
    });
    console.log("Fetched tasks:", tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    dispatch({
      type: actionTypes.FETCH_TASKS_ERROR,
      payload: error.message,
    });
  }
};

export const getFilteredTasks = async (dispatch, date) => {
  try {
    dispatch({ type: actionTypes.FETCH_CALENDAR_TASKS_START });
    const tasks = await taskAPI.getTaskByDate(date);
    dispatch({
      type: actionTypes.FETCH_CALENDAR_TASKS_SUCCESS,
      payload: tasks,
    });
    console.log("Filtered tasks:", tasks);
  } catch (error) {
    console.error("Failed to fetch filtered tasks:", error);
    dispatch({
      type: actionTypes.FETCH_CALENDAR_TASKS_ERROR,
      payload: error.message,
    });
  }
};

// Combined actions for complex operations
export const handleDateSelect = async (dispatch, date, formattedDate) => {
  setSelectedDate(dispatch, date);
  console.log("Selected date (local):", formattedDate);
  await getFilteredTasks(dispatch, formattedDate);
};

export const handleTaskClick = (dispatch, task) => {
  setSelectedTask(dispatch, task);
  setModalVisible(dispatch, true);
};

export const handleAddTask = (dispatch) => {
  setAddTaskOpen(dispatch, true);
};

export const handleCloseModal = (dispatch) => {
  setModalVisible(dispatch, false);
  setSelectedTask(dispatch, null);
};

export const handleCloseAddTask = (dispatch) => {
  setAddTaskOpen(dispatch, false);
};

// Delete task action
export const deleteTask = async (dispatch, taskId) => {
  try {
    dispatch({ type: actionTypes.DELETE_TASK_START });
    await taskAPI.deleteTask(taskId);
    dispatch({
      type: actionTypes.DELETE_TASK_SUCCESS,
      payload: taskId,
    });
    // Refresh tasks after deletion
    await fetchTasks(dispatch);
  } catch (error) {
    console.error("Failed to delete task:", error);
    dispatch({
      type: actionTypes.DELETE_TASK_ERROR,
      payload: error.message,
    });
  }
};

// Edit task action (open edit modal)
export const handleEditTask = (dispatch, task) => {
  setSelectedTask(dispatch, task);
  setAddTaskOpen(dispatch, true);
};

// Utility functions
export const formatTime = (timeStr) => {
  // Remove the :00 seconds using regex
  return timeStr.replace(/:00\s/, " ");
};

export const getGroupedTasks = (allTasks) => {
  const groupedTasks = {
    active: [],
    upcoming: [],
    completed: [],
    pending: [],
  };

  allTasks.forEach((task) => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  return groupedTasks;
};

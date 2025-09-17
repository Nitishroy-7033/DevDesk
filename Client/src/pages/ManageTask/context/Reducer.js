import * as actionTypes from "./Types";

export const initialState = {
  selectedDate: new Date(),
  allTasks: [],
  calendarTasks: [],
  activeView: "table",
  selectedTask: null,
  isModalVisible: false,
  isAddTaskOpen: false,
  loading: false,
  error: null,
  tasksLoading: false,
  calendarLoading: false,
};

export const taskReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };

    case actionTypes.SET_ALL_TASKS:
      return {
        ...state,
        allTasks: action.payload,
      };

    case actionTypes.SET_CALENDAR_TASKS:
      return {
        ...state,
        calendarTasks: action.payload,
      };

    case actionTypes.SET_ACTIVE_VIEW:
      return {
        ...state,
        activeView: action.payload,
      };

    case actionTypes.SET_SELECTED_TASK:
      return {
        ...state,
        selectedTask: action.payload,
      };

    case actionTypes.SET_MODAL_VISIBLE:
      return {
        ...state,
        isModalVisible: action.payload,
      };

    case actionTypes.SET_ADD_TASK_OPEN:
      return {
        ...state,
        isAddTaskOpen: action.payload,
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case actionTypes.FETCH_TASKS_START:
      return {
        ...state,
        tasksLoading: true,
        error: null,
      };

    case actionTypes.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        allTasks: action.payload,
        tasksLoading: false,
        error: null,
      };

    case actionTypes.FETCH_TASKS_ERROR:
      return {
        ...state,
        tasksLoading: false,
        error: action.payload,
      };

    case actionTypes.FETCH_CALENDAR_TASKS_START:
      return {
        ...state,
        calendarLoading: true,
        error: null,
      };

    case actionTypes.FETCH_CALENDAR_TASKS_SUCCESS:
      return {
        ...state,
        calendarTasks: action.payload,
        calendarLoading: false,
        error: null,
      };

    case actionTypes.FETCH_CALENDAR_TASKS_ERROR:
      return {
        ...state,
        calendarLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

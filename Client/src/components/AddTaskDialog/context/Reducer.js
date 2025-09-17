import * as actionTypes from "./Types";

export const initialState = {
  // Form Data
  title: "",
  description: "",
  startTime: null,
  endTime: null,
  startDate: new Date(),
  endDate: new Date(),
  icon: "",
  repeatType: "daily",
  repeatDays: [],

  // Modal State
  isModalOpen: false,
  mode: "add", // "add" or "edit"
  taskData: null,

  // UI State
  loading: false,
  error: null,
  validationErrors: {},

  // Calculated Values
  duration: null,
  dateRangeDuration: null,
};

export const addTaskReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_TITLE:
      return {
        ...state,
        title: action.payload,
        validationErrors: {
          ...state.validationErrors,
          title: null,
        },
      };

    case actionTypes.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };

    case actionTypes.SET_START_TIME:
      const newState = {
        ...state,
        startTime: action.payload,
        validationErrors: {
          ...state.validationErrors,
          timeRange: null,
        },
      };

      // Calculate duration if both times are set
      if (action.payload && state.endTime) {
        const start = new Date(action.payload);
        const end = new Date(state.endTime);
        const diffInMs = end - start;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        if (diffInMs > 0) {
          const hours = Math.floor(diffInMinutes / 60);
          const minutes = diffInMinutes % 60;
          newState.duration = `${hours}h ${minutes}m`;
        } else {
          newState.duration = null;
        }
      }

      return newState;

    case actionTypes.SET_END_TIME:
      const endTimeState = {
        ...state,
        endTime: action.payload,
        validationErrors: {
          ...state.validationErrors,
          timeRange: null,
        },
      };

      // Calculate duration if both times are set
      if (state.startTime && action.payload) {
        const start = new Date(state.startTime);
        const end = new Date(action.payload);
        const diffInMs = end - start;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        if (diffInMs > 0) {
          const hours = Math.floor(diffInMinutes / 60);
          const minutes = diffInMinutes % 60;
          endTimeState.duration = `${hours}h ${minutes}m`;
        } else {
          endTimeState.duration = null;
        }
      }

      return endTimeState;

    case actionTypes.SET_START_DATE:
      return {
        ...state,
        startDate: action.payload,
        validationErrors: {
          ...state.validationErrors,
          dateRange: null,
        },
      };

    case actionTypes.SET_END_DATE:
      return {
        ...state,
        endDate: action.payload,
        validationErrors: {
          ...state.validationErrors,
          dateRange: null,
        },
      };

    case actionTypes.SET_ICON:
      return {
        ...state,
        icon: action.payload,
      };

    case actionTypes.SET_REPEAT_TYPE:
      return {
        ...state,
        repeatType: action.payload,
      };

    case actionTypes.SET_REPEAT_DAYS:
      return {
        ...state,
        repeatDays: action.payload,
      };

    case actionTypes.SET_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: action.payload,
      };

    case actionTypes.SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };

    case actionTypes.SET_TASK_DATA:
      return {
        ...state,
        title: action.payload.title || "",
        description: action.payload.description || "",
        startTime: action.payload.startTime || null,
        endTime: action.payload.endTime || null,
        startDate: action.payload.startDate
          ? new Date(action.payload.startDate)
          : new Date(),
        endDate: action.payload.endDate
          ? new Date(action.payload.endDate)
          : new Date(),
        icon: action.payload.icon || "",
        repeatType: action.payload.repeatType || "daily",
        repeatDays: action.payload.repeatDays || [],
        taskData: action.payload,
      };

    case actionTypes.SET_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: action.payload,
      };

    case actionTypes.CLEAR_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: {},
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

    case actionTypes.CREATE_TASK_START:
    case actionTypes.UPDATE_TASK_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.CREATE_TASK_SUCCESS:
    case actionTypes.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        // Reset form on success
        ...initialState,
      };

    case actionTypes.RESET_FORM:
      return {
        ...state,
        ...{
          title: "",
          description: "",
          startTime: null,
          endTime: null,
          startDate: new Date(),
          endDate: new Date(),
          icon: "",
          repeatType: "daily",
          repeatDays: [],
          validationErrors: {},
        },
      };

    case actionTypes.CREATE_TASK_ERROR:
    case actionTypes.UPDATE_TASK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

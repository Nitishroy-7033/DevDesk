import * as actionTypes from "./Types";

export const initialState = {
  // Data
  userStats: null,
  weeklyLeaderboard: [],
  monthlyLeaderboard: [],
  categoryStats: [],

  // UI State
  activeTab: "overview",

  // Loading States
  loading: true,
  userStatsLoading: false,
  leaderboardLoading: false,
  categoryStatsLoading: false,

  // Error State
  error: null,
};

export const progressReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_STATS:
      return {
        ...state,
        userStats: action.payload,
      };

    case actionTypes.SET_WEEKLY_LEADERBOARD:
      return {
        ...state,
        weeklyLeaderboard: action.payload,
      };

    case actionTypes.SET_MONTHLY_LEADERBOARD:
      return {
        ...state,
        monthlyLeaderboard: action.payload,
      };

    case actionTypes.SET_CATEGORY_STATS:
      return {
        ...state,
        categoryStats: action.payload,
      };

    case actionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
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

    // User Stats Loading
    case actionTypes.FETCH_USER_STATS_START:
      return {
        ...state,
        userStatsLoading: true,
        error: null,
      };

    case actionTypes.FETCH_USER_STATS_SUCCESS:
      return {
        ...state,
        userStats: action.payload,
        userStatsLoading: false,
        error: null,
      };

    case actionTypes.FETCH_USER_STATS_ERROR:
      return {
        ...state,
        userStatsLoading: false,
        error: action.payload,
      };

    // Leaderboard Loading
    case actionTypes.FETCH_LEADERBOARD_START:
      return {
        ...state,
        leaderboardLoading: true,
        error: null,
      };

    case actionTypes.FETCH_LEADERBOARD_SUCCESS:
      return {
        ...state,
        weeklyLeaderboard: action.payload.weekly,
        monthlyLeaderboard: action.payload.monthly,
        leaderboardLoading: false,
        error: null,
      };

    case actionTypes.FETCH_LEADERBOARD_ERROR:
      return {
        ...state,
        leaderboardLoading: false,
        error: action.payload,
      };

    // Category Stats Loading
    case actionTypes.FETCH_CATEGORY_STATS_START:
      return {
        ...state,
        categoryStatsLoading: true,
        error: null,
      };

    case actionTypes.FETCH_CATEGORY_STATS_SUCCESS:
      return {
        ...state,
        categoryStats: action.payload,
        categoryStatsLoading: false,
        error: null,
      };

    case actionTypes.FETCH_CATEGORY_STATS_ERROR:
      return {
        ...state,
        categoryStatsLoading: false,
        error: action.payload,
      };

    // All Data Loading
    case actionTypes.FETCH_ALL_DATA_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.FETCH_ALL_DATA_SUCCESS:
      return {
        ...state,
        userStats: action.payload.userStats,
        weeklyLeaderboard: action.payload.weeklyLeaderboard,
        monthlyLeaderboard: action.payload.monthlyLeaderboard,
        categoryStats: action.payload.categoryStats,
        loading: false,
        error: null,
      };

    case actionTypes.FETCH_ALL_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

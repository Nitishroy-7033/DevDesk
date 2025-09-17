import { apiClient } from "@/lib/api-client";
import * as actionTypes from "./Types";

// Action creators for setting state
export const setActiveTab = (dispatch, tab) => {
  dispatch({
    type: actionTypes.SET_ACTIVE_TAB,
    payload: tab,
  });
};

export const setUserStats = (dispatch, stats) => {
  dispatch({
    type: actionTypes.SET_USER_STATS,
    payload: stats,
  });
};

export const setError = (dispatch, error) => {
  dispatch({
    type: actionTypes.SET_ERROR,
    payload: error,
  });
};

// Async actions for API calls
export const fetchUserStats = async (dispatch, userId) => {
  try {
    dispatch({ type: actionTypes.FETCH_USER_STATS_START });
    const stats = await apiClient.getUserStats(userId);
    dispatch({
      type: actionTypes.FETCH_USER_STATS_SUCCESS,
      payload: stats,
    });
    return stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    dispatch({
      type: actionTypes.FETCH_USER_STATS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

export const fetchLeaderboard = async (dispatch) => {
  try {
    dispatch({ type: actionTypes.FETCH_LEADERBOARD_START });

    const [weeklyData, monthlyData] = await Promise.all([
      apiClient.getLeaderboard("weekly"),
      apiClient.getLeaderboard("monthly"),
    ]);

    dispatch({
      type: actionTypes.FETCH_LEADERBOARD_SUCCESS,
      payload: {
        weekly: weeklyData,
        monthly: monthlyData,
      },
    });

    return { weeklyData, monthlyData };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    dispatch({
      type: actionTypes.FETCH_LEADERBOARD_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

export const fetchCategoryStats = async (dispatch) => {
  try {
    dispatch({ type: actionTypes.FETCH_CATEGORY_STATS_START });

    const categories = ["Math", "Physics", "History", "Chemistry", "Biology"];
    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const timeSpent = await apiClient.getTimeSpentOnSimilarTasks(category);
        const tasks = await apiClient.getTasksByCategory(category);
        const completedTasks = tasks.filter(
          (task) => task.status === "completed"
        );
        return {
          category,
          timeSpent,
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          completionRate:
            tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
        };
      })
    );

    dispatch({
      type: actionTypes.FETCH_CATEGORY_STATS_SUCCESS,
      payload: categoryData,
    });

    return categoryData;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    dispatch({
      type: actionTypes.FETCH_CATEGORY_STATS_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Combined action to fetch all progress data
export const fetchAllProgressData = async (dispatch, userId) => {
  try {
    dispatch({ type: actionTypes.FETCH_ALL_DATA_START });

    const [userStats, leaderboardData, categoryStats] = await Promise.all([
      apiClient.getUserStats(userId),
      Promise.all([
        apiClient.getLeaderboard("weekly"),
        apiClient.getLeaderboard("monthly"),
      ]),
      Promise.all(
        ["Math", "Physics", "History", "Chemistry", "Biology"].map(
          async (category) => {
            const timeSpent = await apiClient.getTimeSpentOnSimilarTasks(
              category
            );
            const tasks = await apiClient.getTasksByCategory(category);
            const completedTasks = tasks.filter(
              (task) => task.status === "completed"
            );
            return {
              category,
              timeSpent,
              totalTasks: tasks.length,
              completedTasks: completedTasks.length,
              completionRate:
                tasks.length > 0
                  ? (completedTasks.length / tasks.length) * 100
                  : 0,
            };
          }
        )
      ),
    ]);

    dispatch({
      type: actionTypes.FETCH_ALL_DATA_SUCCESS,
      payload: {
        userStats,
        weeklyLeaderboard: leaderboardData[0],
        monthlyLeaderboard: leaderboardData[1],
        categoryStats,
      },
    });

    return {
      userStats,
      weeklyLeaderboard: leaderboardData[0],
      monthlyLeaderboard: leaderboardData[1],
      categoryStats,
    };
  } catch (error) {
    console.error("Error fetching progress data:", error);
    dispatch({
      type: actionTypes.FETCH_ALL_DATA_ERROR,
      payload: error.message,
    });
    throw error;
  }
};

// Utility functions
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

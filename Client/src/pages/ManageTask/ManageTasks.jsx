import { useReducer, useEffect } from "react";
import { useAuth } from "@/pages/Auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { taskReducer, initialState } from "./context/Reducer";
import * as actions from "./context/Actions";
import TasksHeader from "./components/TasksHeader";
import TasksTabs from "./components/TasksTabs";
import "./ManageTasks.css";

const ManageTasks = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const {
    selectedDate,
    allTasks,
    calendarTasks,
    activeView,
    selectedTask,
    isModalVisible,
    isAddTaskOpen,
    tasksLoading,
    calendarLoading,
    error,
  } = state;

  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        actions.fetchTasks(dispatch);
      }
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, the useEffect will handle navigation
  if (!isLoggedIn) {
    return null;
  }

  // Event handlers using action creators
  const handleViewChange = (view) => {
    actions.setActiveView(dispatch, view);
  };

  const handleDateSelect = (date, formattedDate) => {
    actions.handleDateSelect(dispatch, date, formattedDate);
  };

  const handleTaskClick = (task) => {
    actions.handleTaskClick(dispatch, task);
  };

  const handleAddTask = () => {
    actions.handleAddTask(dispatch);
  };

  const handleCloseModal = () => {
    actions.handleCloseModal(dispatch);
  };

  const handleCloseAddTask = () => {
    actions.handleCloseAddTask(dispatch);
  };

  const handleRefresh = () => {
    actions.fetchTasks(dispatch);
  };

  return (
    <div>
      <main className="main-content">
        <TasksHeader onAddTask={handleAddTask} onRefresh={handleRefresh} />

        <TasksTabs
          activeView={activeView}
          onViewChange={handleViewChange}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          calendarTasks={calendarTasks}
          allTasks={allTasks}
          onTaskClick={handleTaskClick}
          formatTime={actions.formatTime}
        />
      </main>

      {/* View Task Modal */}
      <AddTaskDialog
        open={isModalVisible}
        onOpenChange={handleCloseModal}
        mode="view"
        task={selectedTask}
      />

      {/* Add Task Modal */}
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={handleCloseAddTask}
        mode="add"
      />

      {/* Error Display */}
      {error && <div className="error-banner">Error: {error}</div>}
    </div>
  );
};

export default ManageTasks;

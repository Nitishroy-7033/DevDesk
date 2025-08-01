import { useEffect } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ManageTasks.css";
import TasksHeader from "../components/Tasks/TasksHeader";
import TasksTabs from "../components/Tasks/TasksTabs";
import useTaskManagement from "../hooks/useTaskManagement";

export const ManageTasks = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const {
    selectedDate,
    allTasks,
    calendarTasks,
    activeView,
    selectedTask,
    isModalVisible,
    isAddTaskOpen,
    setActiveView,
    fetchTasks,
    formatTime,
    handleDateSelect,
    handleTaskClick,
    handleAddTask,
    handleCloseModal,
    handleCloseAddTask,
  } = useTaskManagement();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, [isLoggedIn, navigate, fetchTasks]);

  return (
    <div>
      <main className="main-content">
        <TasksHeader onAddTask={handleAddTask} onRefresh={fetchTasks} />

        <TasksTabs
          activeView={activeView}
          onViewChange={setActiveView}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          calendarTasks={calendarTasks}
          allTasks={allTasks}
          onTaskClick={handleTaskClick}
          formatTime={formatTime}
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
    </div>
  );
};

export default ManageTasks;

import { useState, useEffect, useCallback } from "react";
import { taskAPI } from "../lib/api";

export const useTaskManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [activeView, setActiveView] = useState("table");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const tasks = await taskAPI.getTasks();
      setAllTasks(tasks);
      console.log("Fetched tasks:", tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, []);

  const getFilteredTasks = async (date) => {
    try {
      const tasks = await taskAPI.getTaskByDate(date);
      setCalendarTasks(tasks);
      console.log("Filtered tasks:", tasks);
    } catch (error) {
      console.error("Failed to fetch filtered tasks:", error);
    }
  };

  const formatTime = (timeStr) => {
    // Remove the :00 seconds using regex
    return timeStr.replace(/:00\s/, " ");
  };

  const handleDateSelect = (date, formattedDate) => {
    setSelectedDate(date);
    console.log("Selected date (local):", formattedDate);
    getFilteredTasks(formattedDate);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleAddTask = () => {
    setIsAddTaskOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const handleCloseAddTask = () => {
    setIsAddTaskOpen(false);
  };

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

  return {
    // State
    selectedDate,
    allTasks,
    calendarTasks,
    activeView,
    selectedTask,
    isModalVisible,
    isAddTaskOpen,
    groupedTasks,

    // Actions
    setActiveView,
    fetchTasks,
    getFilteredTasks,
    formatTime,
    handleDateSelect,
    handleTaskClick,
    handleAddTask,
    handleCloseModal,
    handleCloseAddTask,
  };
};

export default useTaskManagement;

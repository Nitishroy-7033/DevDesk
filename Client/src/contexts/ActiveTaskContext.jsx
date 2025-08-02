import { createContext, useContext, useState, useEffect } from "react";
import { taskAPI } from "@/lib/api";

const ActiveTaskContext = createContext(undefined);

// Storage keys for persistence
const STORAGE_KEYS = {
  ACTIVE_TASK: "zappy_active_task",
  TIMER_STATE: "zappy_timer_state",
  AVAILABLE_TASKS: "zappy_available_tasks",
  AUTO_SAVE_ENABLED: "zappy_auto_save_enabled",
};

export const ActiveTaskProvider = ({ children }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Enhanced completion tracking state
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [taskEndTime, setTaskEndTime] = useState(null);
  const [completionMethod, setCompletionMethod] = useState(null); // "countdown" or "manual"

  // Load state from localStorage on component mount
  useEffect(() => {
    const loadPersistedState = () => {
      try {
        const savedActiveTask = localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK);
        const savedTimerState = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
        const savedAvailableTasks = localStorage.getItem(
          STORAGE_KEYS.AVAILABLE_TASKS
        );

        if (savedActiveTask) {
          const parsedActiveTask = JSON.parse(savedActiveTask);
          setActiveTask(parsedActiveTask);
        }

        if (savedTimerState) {
          const timerState = JSON.parse(savedTimerState);
          const now = Date.now();
          const timeDiff = Math.floor((now - timerState.lastUpdateTime) / 1000);

          setTotalTime(timerState.totalTime);

          // Only restore completion state if we have a saved active task
          if (savedActiveTask) {
            setIsCompleted(timerState.isCompleted);
          }

          if (timerState.isRunning && !timerState.isCompleted) {
            // Calculate how much time has passed since last update
            const adjustedTimeRemaining = Math.max(
              0,
              timerState.timeRemaining - timeDiff
            );

            if (adjustedTimeRemaining > 0) {
              setTimeRemaining(adjustedTimeRemaining);
              setIsRunning(true);
            } else {
              // Timer completed while away
              setTimeRemaining(0);
              setIsRunning(false);
              setIsCompleted(true);
            }
          } else {
            setTimeRemaining(timerState.timeRemaining);
            setIsRunning(false);
          }
        }

        if (savedAvailableTasks) {
          const parsedTasks = JSON.parse(savedAvailableTasks);
          setAvailableTasks(parsedTasks);
        }

        // Load auto-save preference
        const savedAutoSave = localStorage.getItem(
          STORAGE_KEYS.AUTO_SAVE_ENABLED
        );
        if (savedAutoSave !== null) {
          setAutoSaveEnabled(JSON.parse(savedAutoSave));
        }
      } catch (error) {
        console.error("Error loading persisted state:", error);
        // Clear corrupted data
        clearPersistedState();
      }
    };

    loadPersistedState();
  }, []);

  // Save state to localStorage whenever relevant state changes (only if auto-save is enabled)
  useEffect(() => {
    const saveTimerState = () => {
      if (activeTask && autoSaveEnabled) {
        const timerState = {
          timeRemaining,
          totalTime,
          isRunning,
          isCompleted,
          lastUpdateTime: Date.now(),
        };
        localStorage.setItem(
          STORAGE_KEYS.TIMER_STATE,
          JSON.stringify(timerState)
        );
      }
    };

    saveTimerState();
  }, [
    timeRemaining,
    totalTime,
    isRunning,
    isCompleted,
    activeTask,
    autoSaveEnabled,
  ]);

  // Save active task to localStorage (only if auto-save is enabled)
  useEffect(() => {
    if (autoSaveEnabled) {
      if (activeTask) {
        localStorage.setItem(
          STORAGE_KEYS.ACTIVE_TASK,
          JSON.stringify(activeTask)
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK);
      }
    }
  }, [activeTask, autoSaveEnabled]);

  // Save available tasks to localStorage (only if auto-save is enabled)
  useEffect(() => {
    if (availableTasks.length > 0 && autoSaveEnabled) {
      localStorage.setItem(
        STORAGE_KEYS.AVAILABLE_TASKS,
        JSON.stringify(availableTasks)
      );
    }
  }, [availableTasks, autoSaveEnabled]);

  // Save auto-save preference to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.AUTO_SAVE_ENABLED,
      JSON.stringify(autoSaveEnabled)
    );
  }, [autoSaveEnabled]);

  // Clear persisted state
  const clearPersistedState = () => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK);
    localStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
    localStorage.removeItem(STORAGE_KEYS.AVAILABLE_TASKS);
    // Don't clear auto-save preference as it's a user setting
  };

  // Toggle auto-save functionality
  const toggleAutoSave = () => {
    const newAutoSaveState = !autoSaveEnabled;
    setAutoSaveEnabled(newAutoSaveState);

    if (!newAutoSaveState) {
      // If disabling auto-save, clear existing saved data
      clearPersistedState();
    }
  };

  // Calculate duration in seconds from time strings
  const calculateDuration = (startTime, endTime) => {
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period?.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      } else if (period?.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    // Convert minutes to seconds
    return (endMinutes - startMinutes) * 60;
  };

  // Set active task from upcoming tasks
  const setActiveTaskFromUpcoming = (task) => {
    if (!task) return;

    const duration = calculateDuration(task.startTime, task.endTime);
    setActiveTask(task);
    setTotalTime(duration);
    setTimeRemaining(duration);
    setIsCompleted(false);
    setIsRunning(false);
    setTaskStartTime(null); // Reset start time for new task
    setTaskEndTime(null); // Reset end time for new task
    setCompletionMethod(null); // Reset completion method
  };

  // Set available tasks and auto-select first non-completed task if no active task
  const setAvailableTasksAndAutoSelect = (tasks) => {
    setAvailableTasks(tasks);

    // Auto-select first non-completed task if no active task is selected and tasks are available
    if (!activeTask && tasks.length > 0) {
      // Try to find the first task that's not completed
      // Since we don't have direct status on tasks, we'll just pick the first task
      // and let the UpcomingTasksPanel filter handle completed tasks
      const firstTask = tasks[0];
      setActiveTaskFromUpcoming(firstTask);
    }
  };

  // Get next task in the list
  const getNextTask = () => {
    if (!activeTask || availableTasks.length === 0) return null;

    const currentIndex = availableTasks.findIndex(
      (task) => task.id === activeTask.id
    );
    if (currentIndex === -1 || currentIndex === availableTasks.length - 1)
      return null;

    return availableTasks[currentIndex + 1];
  };

  // Move to next task
  const moveToNextTask = () => {
    const nextTask = getNextTask();
    if (nextTask) {
      setActiveTaskFromUpcoming(nextTask);
    }
  };

  // Handle page visibility changes to pause/resume timer (only if auto-save is enabled)
  useEffect(() => {
    if (!autoSaveEnabled) return; // Skip if auto-save is disabled

    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        // Page is hidden, save current state
        setLastUpdateTime(Date.now());
      } else if (!document.hidden && isRunning) {
        // Page is visible again, check if we need to update timer
        const savedTimerState = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
        if (savedTimerState) {
          const timerState = JSON.parse(savedTimerState);
          const now = Date.now();
          const timeDiff = Math.floor((now - timerState.lastUpdateTime) / 1000);

          if (timeDiff > 0 && timeRemaining > timeDiff) {
            setTimeRemaining((prev) => Math.max(0, prev - timeDiff));
          } else if (timeDiff >= timeRemaining) {
            // Timer completed while away
            setTimeRemaining(0);
            setIsRunning(false);
            setIsCompleted(true);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also handle page unload to save state
    const handleBeforeUnload = () => {
      if (isRunning) {
        setLastUpdateTime(Date.now());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRunning, timeRemaining, autoSaveEnabled]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0 && activeTask) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (autoSaveEnabled) {
            setLastUpdateTime(Date.now()); // Update timestamp for persistence only if auto-save is enabled
          }
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            setTaskEndTime(new Date().toISOString());
            setCompletionMethod("countdown");
            // Auto-complete task when countdown finishes
            handleCountdownComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, activeTask, autoSaveEnabled]);

  const startTimer = () => {
    if (activeTask && timeRemaining > 0) {
      setIsRunning(true);
      if (!taskStartTime) {
        setTaskStartTime(new Date().toISOString());
      }
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const completeTask = async () => {
    if (!activeTask) return;

    setIsRunning(false);
    setIsCompleted(true);

    try {
      const startTime = taskStartTime ? new Date(taskStartTime) : new Date();
      const endTime = new Date();
      const actualDurationMinutes = Math.round(
        (endTime - startTime) / (1000 * 60)
      );

      await submitTaskCompletion({
        actualStartTime: startTime.toISOString(),
        actualEndTime: endTime.toISOString(),
        actualDurationMinutes,
      });

      // Show success message
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Task completed successfully!");
      } else {
        console.log("Demo task completed! Login to save your real tasks.");
      }

      // Optionally clear the task after a delay
      setTimeout(() => {
        clearActiveTask();
      }, 2000);
    } catch (error) {
      console.error("Error completing task:", error);
      // Still mark as completed locally even if API fails
    }
  };

  const resetTask = () => {
    setIsCompleted(false);
    setTimeRemaining(totalTime);
    setIsRunning(false);
    setLastUpdateTime(Date.now());
  };

  const resetTaskWithConfirmation = () => {
    if (isRunning || timeRemaining < totalTime) {
      const confirmed = window.confirm(
        "Are you sure you want to reset this task? This will reset your progress and stop the timer."
      );
      if (confirmed) {
        resetTask();
      }
    } else {
      resetTask();
    }
  };

  const clearActiveTask = () => {
    setActiveTask(null);
    setIsRunning(false);
    setTimeRemaining(0);
    setTotalTime(0);
    setIsCompleted(false);
    clearPersistedState(); // Clear all persisted data
  };

  // Enhanced completion tracking methods
  const handleCountdownComplete = async () => {
    if (!activeTask) return;

    try {
      const startTime = taskStartTime ? new Date(taskStartTime) : new Date();
      const endTime = new Date();
      const actualDurationMinutes = Math.round(
        (endTime - startTime) / (1000 * 60)
      );

      await submitTaskCompletion({
        actualStartTime: startTime.toISOString(),
        actualEndTime: endTime.toISOString(),
        actualDurationMinutes,
      });
    } catch (error) {
      console.error("Error auto-completing task:", error);
    }
  };

  const submitTaskCompletion = async (completionData) => {
    if (!activeTask) return;

    const completionRequest = {
      taskId: activeTask.id,
      completionDate: new Date().toISOString(),
      notes: completionData.notes || "",
      completionType: "Timer",
    };

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      // Demo mode - simulate completion
      console.log("Demo mode: Simulating task completion for timer");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, message: "Demo task completed!" };
    }

    return await taskAPI.completeTask(completionRequest);
  };

  const value = {
    activeTask,
    isRunning,
    timeRemaining,
    totalTime,
    isCompleted,
    availableTasks,
    autoSaveEnabled,
    taskStartTime,
    taskEndTime,
    completionMethod,
    setActiveTaskFromUpcoming,
    setAvailableTasksAndAutoSelect,
    startTimer,
    pauseTimer,
    completeTask,
    resetTask,
    resetTaskWithConfirmation,
    clearActiveTask,
    clearPersistedState,
    toggleAutoSave,
    getNextTask,
    moveToNextTask,
    submitTaskCompletion,
    hasNextTask: !!getNextTask(),
    progress:
      totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0,
  };

  return (
    <ActiveTaskContext.Provider value={value}>
      {children}
    </ActiveTaskContext.Provider>
  );
};

export const useActiveTask = () => {
  const context = useContext(ActiveTaskContext);
  if (context === undefined) {
    throw new Error("useActiveTask must be used within an ActiveTaskProvider");
  }
  return context;
};

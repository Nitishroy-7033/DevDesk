import { useCallback } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for task management with built-in error handling and toast notifications
 */
export const useTaskManager = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasksForUserAsync,
    createTask,
    updateTask,
    deleteTask,
    executeTask,
    getTaskHistory,
    clearError
  } = useTodo();

  const { toast } = useToast();

  // Fetch tasks with error handling
  const fetchTasks = useCallback(async (date, statusFilter = "Pending") => {
    try {
      await fetchTasksForUserAsync(date, statusFilter);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchTasksForUserAsync, toast]);

  // Create task with success/error feedback
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      return newTask;
    } catch (error) {
      toast({
        title: "Error", 
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
      throw error;
    }
  }, [createTask, toast]);

  // Update task with feedback
  const handleUpdateTask = useCallback(async (taskId, updates) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
      return updatedTask;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive", 
      });
      throw error;
    }
  }, [updateTask, toast]);

  // Delete task with confirmation and feedback
  const handleDeleteTask = useCallback(async (taskId, taskTitle = "task") => {
    try {
      await deleteTask(taskId);
      toast({
        title: "Success",
        description: `${taskTitle} deleted successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  }, [deleteTask, toast]);

  // Execute task with feedback
  const handleExecuteTask = useCallback(async (taskData) => {
    try {
      const result = await executeTask(taskData);
      toast({
        title: "Success", 
        description: "Task executed successfully!",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to execute task",
        variant: "destructive",
      });
      throw error;
    }
  }, [executeTask, toast]);

  // Get task history with error handling
  const fetchTaskHistory = useCallback(async () => {
    try {
      const history = await getTaskHistory();
      return history;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch task history",
        variant: "destructive",
      });
      throw error;
    }
  }, [getTaskHistory, toast]);

  // Clear error and toast
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
  };

  return {
    // State
    tasks,
    loading,
    error,
    taskStats,

    // Actions with error handling
    fetchTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    executeTask: handleExecuteTask,
    getTaskHistory: fetchTaskHistory,
    clearError: handleClearError,

    // Utilities
    isLoading: loading,
    hasError: !!error,
    isEmpty: tasks.length === 0,
  };
};

export default useTaskManager;

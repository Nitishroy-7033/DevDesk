using System;
using MongoDB.Driver;
using TaskManager.Models;

namespace TaskManager.Repositories.Interfaces;

public interface ITaskRepository
{
    // Basic CRUD operations
    Task CreateTask(TaskItem task);
    Task<TaskItem?> GetTaskByIdAsync(string id);
    Task<bool> UpdateTaskAsync(TaskItem task);
    Task DeleteTaskAsync(string id);
    Task<List<TaskItem>> GetFilteredTasks(FilterDefinition<TaskItem> filter);

    // Date-based queries
    Task<List<TaskItem>> GetTasksForDateAsync(string userId, DateTime date);
    Task<List<TaskItem>> GetUpcomingTasksAsync(DateTime date);
    Task<List<TaskItem>> GetTasksInDateRangeAsync(string userId, DateTime fromDate, DateTime toDate);

    // Execution tracking
    Task CreateTaskExecution(TaskExecutionRecord execution);
    Task<TaskExecutionRecord?> GetTaskExecutionAsync(string taskId, string userId, DateTime date);
    Task<bool> UpdateTaskExecutionAsync(TaskExecutionRecord execution);
    Task<List<TaskExecutionRecord>> GetUserExecutionHistoryAsync(string userId, DateTime fromDate, DateTime toDate);

    // Analytics and statistics
    Task<List<TaskExecutionRecord>> GetCompletedTasksInRangeAsync(string userId, DateTime fromDate, DateTime toDate);
    Task UpdateTaskStatisticsAsync(string taskId, int completions, int skips, double avgTime, double completionRate);
}

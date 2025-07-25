using System;
using TaskManager.Models;
using TaskManager.Models.Response;

namespace TaskManager.Services.Interfaces;

public interface ITaskService
{
    // Basic task management
    Task CreateNewTask(string userId, TaskRequest task);
    Task<TaskItem?> GetTaskByIdAsync(string userId, string id);
    Task<bool> UpdateTaskAsync(string userId, string id, TaskRequest taskRequest);
    Task DeleteTask(string userId, string id);

    // Query operations
    Task<List<TaskItem>> GetAllTask(string userId, TaskQueryRequest query);
    Task<List<TaskItem>> GetUpcomingTasksAsync(string userId, DateTime date);
    Task<TaskDayResponse> GetTasksForDayAsync(string userId, DateTime date);
    Task<List<TaskItem>> GetTasksInRangeAsync(string userId, DateTime fromDate, DateTime toDate);

    // Task execution and completion
    Task<TaskExecutionRecord> StartTaskAsync(string userId, string taskId, DateTime executionDate);
    Task<TaskExecutionRecord> CompleteTaskAsync(string userId, TaskCompletionRequest request);
    Task<TaskExecutionRecord> UpdateTaskExecutionAsync(string userId, TaskExecutionRequest request);
    Task<List<TaskExecutionRecord>> GetExecutionHistoryAsync(string userId, DateTime fromDate, DateTime toDate);

    // Analytics
    Task<TaskAnalyticsResponse> GetTaskAnalyticsAsync(string userId, DateTime fromDate, DateTime toDate);
    Task UpdateTaskStatisticsAsync(string taskId);

    // User Performance and Activity
    Task<UserPerformanceResponse> GetUserPerformanceAsync(string userId, DateTime fromDate, DateTime toDate);
    Task<List<TopPerformerResponse>> GetTopPerformersAsync(DateTime fromDate, DateTime toDate, int limit = 10);
    Task<UserActivityResponse> GetUserActivityAsync(string userId, DateTime fromDate, DateTime toDate);
    Task<LeaderboardResponse> GetDailyGoalLeaderboardAsync(DateTime date, int limit = 10);
}

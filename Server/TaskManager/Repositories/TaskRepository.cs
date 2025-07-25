using System;
using MongoDB.Driver;
using TaskManager.DbContext;
using TaskManager.Models;
using TaskManager.Repositories.Interfaces;

namespace TaskManager.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly IMongoCollection<TaskItem> _task;
    private readonly IMongoCollection<TaskHistory> _history;
    private readonly IMongoCollection<TaskExecutionRecord> _executions;

    public TaskRepository(MongoDbContext<TaskItem> dbContext,
                         MongoDbContext<TaskHistory> dbContextHistory,
                         MongoDbContext<TaskExecutionRecord> dbContextExecution)
    {
        _task = dbContext.GetCollection();
        _history = dbContextHistory.GetCollection();
        _executions = dbContextExecution.GetCollection();
    }

    #region Basic CRUD Operations

    public async Task CreateTask(TaskItem task)
    {
        task.CreatedAt = DateTime.UtcNow;
        task.UpdatedAt = DateTime.UtcNow;
        await _task.InsertOneAsync(task);
    }

    public async Task<TaskItem?> GetTaskByIdAsync(string id)
    {
        return await _task.Find(t => t.Id == id).FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateTaskAsync(TaskItem task)
    {
        task.UpdatedAt = DateTime.UtcNow;
        var result = await _task.ReplaceOneAsync(t => t.Id == task.Id, task);
        return result.ModifiedCount > 0;
    }

    public async Task DeleteTaskAsync(string id)
    {
        await _task.DeleteOneAsync(t => t.Id == id);
    }

    public async Task<List<TaskItem>> GetFilteredTasks(FilterDefinition<TaskItem> filter)
    {
        return await _task.Find(filter).ToListAsync();
    }

    #endregion

    #region Date-based Queries

    public async Task<List<TaskItem>> GetTasksForDateAsync(string userId, DateTime date)
    {
        var builder = Builders<TaskItem>.Filter;

        var filter = builder.And(
            builder.Eq(t => t.UserId, userId),
            builder.Eq(t => t.IsActive, true),
            builder.Lte(t => t.FromDate, date.Date),
            builder.Gte(t => t.ToDate, date.Date)
        );

        var candidateTasks = await _task.Find(filter).ToListAsync();

        // Filter by repeat cycle logic
        return candidateTasks.Where(task => IsTaskScheduledForDate(task, date)).ToList();
    }

    public async Task<List<TaskItem>> GetUpcomingTasksAsync(DateTime date)
    {
        var builder = Builders<TaskItem>.Filter;

        var filter = builder.And(
            builder.Eq(t => t.IsActive, true),
            builder.Lte(t => t.FromDate, date),
            builder.Gte(t => t.ToDate, date)
        );

        var candidateTasks = await _task.Find(filter).ToListAsync();

        return candidateTasks.Where(task => IsTaskScheduledForDate(task, date)).ToList();
    }

    public async Task<List<TaskItem>> GetTasksInDateRangeAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        var builder = Builders<TaskItem>.Filter;

        var filter = builder.And(
            builder.Eq(t => t.UserId, userId),
            builder.Eq(t => t.IsActive, true),
            builder.Or(
                builder.And(
                    builder.Gte(t => t.FromDate, fromDate),
                    builder.Lte(t => t.FromDate, toDate)
                ),
                builder.And(
                    builder.Lte(t => t.FromDate, fromDate),
                    builder.Gte(t => t.ToDate, fromDate)
                )
            )
        );

        return await _task.Find(filter).ToListAsync();
    }

    #endregion

    #region Execution Tracking

    public async Task CreateTaskExecution(TaskExecutionRecord execution)
    {
        execution.CreatedAt = DateTime.UtcNow;
        execution.UpdatedAt = DateTime.UtcNow;
        await _executions.InsertOneAsync(execution);
    }

    public async Task<TaskExecutionRecord?> GetTaskExecutionAsync(string taskId, string userId, DateTime date)
    {
        return await _executions.Find(e =>
            e.TaskId == taskId &&
            e.UserId == userId &&
            e.ExecutionDate.Date == date.Date
        ).FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateTaskExecutionAsync(TaskExecutionRecord execution)
    {
        execution.UpdatedAt = DateTime.UtcNow;
        var result = await _executions.ReplaceOneAsync(e => e.Id == execution.Id, execution);
        return result.ModifiedCount > 0;
    }

    public async Task<List<TaskExecutionRecord>> GetUserExecutionHistoryAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        return await _executions.Find(e =>
            e.UserId == userId &&
            e.ExecutionDate >= fromDate &&
            e.ExecutionDate <= toDate
        ).ToListAsync();
    }

    public async Task<List<TaskExecutionRecord>> GetCompletedTasksInRangeAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        return await _executions.Find(e =>
            e.UserId == userId &&
            e.ExecutionDate >= fromDate &&
            e.ExecutionDate <= toDate &&
            e.Status == "Completed"
        ).ToListAsync();
    }

    #endregion

    #region Analytics and Statistics

    public async Task UpdateTaskStatisticsAsync(string taskId, int completions, int skips, double avgTime, double completionRate)
    {
        var update = Builders<TaskItem>.Update
            .Set(t => t.TotalCompletions, completions)
            .Set(t => t.TotalSkips, skips)
            .Set(t => t.AverageCompletionTime, avgTime)
            .Set(t => t.CompletionRate, completionRate)
            .Set(t => t.UpdatedAt, DateTime.UtcNow);

        await _task.UpdateOneAsync(t => t.Id == taskId, update);
    }

    #endregion

    #region Helper Methods

    private bool IsTaskScheduledForDate(TaskItem task, DateTime date)
    {
        var dayOfWeek = date.DayOfWeek;

        return task.RepeatCycleType.ToLower() switch
        {
            "daily" => true,
            "weekly" => dayOfWeek == task.CustomRepeatDays.FirstOrDefault(),
            "custom" => task.CustomRepeatDays.Contains(dayOfWeek),
            "none" => task.FromDate.Date == date.Date,
            _ => false
        };
    }

    #endregion
}

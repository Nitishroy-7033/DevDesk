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

    public TaskRepository(MongoDbContext<TaskItem> dbContext, MongoDbContext<TaskHistory> dbContextHisotry)
    {
        _task = dbContext.GetCollection();
        _history = dbContextHisotry.GetCollection();
    }

    public async Task CreateTask(TaskItem task)
    {
        await _task.InsertOneAsync(task);
    }

    public async Task<List<TaskItem>> GetFilteredTasks(FilterDefinition<TaskItem> filter)
    {
        return await _task.Find(filter).ToListAsync();
    }

    public async Task<TaskItem> GetTaskByIdAsync(string id)
    {
        return await _task.Find(t => t.Id == id).FirstOrDefaultAsync();
    }
    public async Task DeleteTaskAsync(string id)
    {
        await _task.DeleteOneAsync(t => t.Id == id);
    }
    public async Task<List<TaskItem>> GetUpcomingTasksAsync(DateTime date)
    {
        var builder = Builders<TaskItem>.Filter;

        // MongoDB filter: IsActive = true, FromDate <= date && ToDate >= date
        var filter = builder.And(
            builder.Eq(t => t.IsActive, true),
            builder.Lte(t => t.FromDate, date),
            builder.Gte(t => t.ToDate, date)
        );

        var candidateTasks = await _task.Find(filter).ToListAsync();

        var dayOfWeek = date.DayOfWeek;

        var upcomingTasks = candidateTasks.Where(task =>
        {
            return task.RepeatCycleType.ToLower() switch
            {
                "daily" => true,
                "custom" => task.CustomRepeatDays.Contains(dayOfWeek),
                "tts" => true, // implement your logic here
                _ => false
            };
        }).ToList();

        return upcomingTasks;
    }

}

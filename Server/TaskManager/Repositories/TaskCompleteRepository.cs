using System;
using MongoDB.Driver;
using TaskManager.DbContext;
using TaskManager.Models;
using TaskManager.Repositories.Interfaces;

namespace TaskManager.Repositories;

public class TaskCompleteRepository : ITaskCompleteRepository
{

    private readonly IMongoCollection<CompletedTask> _completedTasks;

    public TaskCompleteRepository(MongoDbContext<CompletedTask> dbContext)
    {
        _completedTasks = dbContext.GetCollection();
    }

    public async Task<CompletedTask?> GetCompletedTaskByIdAsync(string taskId)
    {
        return await _completedTasks.Find(task => task.Id == taskId).FirstOrDefaultAsync();
    }
    public async Task AddCompletedTaskAsync(CompletedTask completedTask)
    {
        await _completedTasks.InsertOneAsync(completedTask);
    }
    public async Task UpdateCompletedTaskAsync(CompletedTask completedTask)
    {
        var filter = Builders<CompletedTask>.Filter.Eq(task => task.Id, completedTask.Id);
        await _completedTasks.ReplaceOneAsync(filter, completedTask);
    }


}

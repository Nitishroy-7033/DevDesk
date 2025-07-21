using System;
using MongoDB.Driver;
using TaskManager.Models;

namespace TaskManager.Repositories.Interfaces;

public interface ITaskRepository
{
    Task CreateTask(TaskItem task);
    Task<List<TaskItem>> GetFilteredTasks(FilterDefinition<TaskItem> filter);
    Task<TaskItem> GetTaskByIdAsync(string id);
    Task DeleteTaskAsync(string id);
    Task<List<TaskItem>> GetUpcomingTasksAsync(DateTime date);
}

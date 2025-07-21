using System;
using TaskManager.Models;
using TaskManager.Models.Response;

namespace TaskManager.Services.Interfaces;

public interface ITaskService
{
    Task CreateNewTask(TaskRequest task);
    Task<List<TaskItem>> GetAllTask(TaskQueryRequest query);
    Task DeleteTask(string id);
    Task<List<TaskItem>> GetUpcomingTasksAsync(DateTime date);
}

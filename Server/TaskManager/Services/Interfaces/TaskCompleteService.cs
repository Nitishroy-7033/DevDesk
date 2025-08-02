using System;
using TaskManager.Models;

namespace TaskManager.Services.Interfaces;

public interface ITaskCompleteService
{
    Task<CompletedTask?> GetCompletedTaskByIdAsync(string taskId);
    Task AddCompletedTaskAsync(TaskCompletionRequest request);
}

using System;
using TaskManager.Models;

namespace TaskManager.Repositories.Interfaces;

public interface ITaskCompleteRepository
{
    Task<CompletedTask?> GetCompletedTaskByIdAsync(string taskId);
    Task AddCompletedTaskAsync(CompletedTask completedTask);
    Task UpdateCompletedTaskAsync(CompletedTask completedTask);
}

using System;
using TaskManager.Models;
using TaskManager.Repositories.Interfaces;
using TaskManager.Services.Interfaces;

namespace TaskManager.Services;

public class TaskCompleteService : ITaskCompleteService
{
    private readonly ITaskCompleteRepository _taskCompleteRepository;
    private readonly ITaskRepository _taskRepository;

    public TaskCompleteService(ITaskCompleteRepository taskCompleteRepository, ITaskRepository taskRepository)
    {
        _taskCompleteRepository = taskCompleteRepository;
        _taskRepository = taskRepository;
    }

    public async Task<CompletedTask?> GetCompletedTaskByIdAsync(string taskId)
    {
        return await _taskCompleteRepository.GetCompletedTaskByIdAsync(taskId);
    }

    public async Task AddCompletedTaskAsync(TaskCompletionRequest request)
    {
        var task = await _taskRepository.GetTaskByIdAsync(request.TaskId);
        if (task == null)
        {
            throw new ArgumentException($"Task with ID {request.TaskId} does not exist.");
        }

        var completedTask = new CompletedTask
        {
            Id = task.Id,
            UserId = task.UserId,
            Title = task.Title,
            Description = task.Description,
            StartTime = task.StartTime,
            EndTime = task.EndTime,
            RepeatCycleType = task.RepeatCycleType,
            CustomRepeatDays = task.CustomRepeatDays,
            FromDate = task.FromDate,
            ToDate = task.ToDate,
            ColorHex = task.ColorHex,
            IconName = task.IconName,
            Priority = task.Priority,
            IsActive = false,
            IsTemplate = task.IsTemplate,
            Tags = task.Tags,
            Category = task.Category,
            EnableReminders = task.EnableReminders,
            ReminderMinutesBefore = task.ReminderMinutesBefore,
            TotalCompletions = task.TotalCompletions + 1,
            TotalSkips = task.TotalSkips,
            AverageCompletionTime = task.AverageCompletionTime, // Optional: You can update this too
            CompletionRate = task.CompletionRate, // Optional: You can update this too
            CreatedAt = task.CreatedAt,
            UpdatedAt = DateTime.UtcNow,
            Notes = request.Notes,
            CompletionType = request.CompletionType,
            Status = "Completed",
            WhenStartedTime = task.FromDate,
            WhenCompletedTime = request.CompletionDate,
            CompletedAt = DateTime.UtcNow
        };

        await _taskCompleteRepository.AddCompletedTaskAsync(completedTask);
    }
}

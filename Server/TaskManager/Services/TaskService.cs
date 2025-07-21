using System;
using MongoDB.Driver;
using TaskManager.Models;
using TaskManager.Models.Response;
using TaskManager.Repositories.Interfaces;
using TaskManager.Services.Interfaces;

namespace TaskManager.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task CreateNewTask(TaskRequest task)
    {
        try
        {
            var newtask = new TaskItem
            {
                UserId = task.UserId,
                Title = task.Title,
                Description = task.Description,
                StartTime = task.StartTime,
                EndTime = task.EndTime,
                RepeatCycleType = task.RepeatCycleType,
                CustomRepeatDays = task.CustomRepeatDays,
                FromDate = task.FromDate ?? DateTime.Today,
                ToDate = task.ToDate ?? DateTime.Today.AddDays(7),
                ColorHex = task.ColorHex,
                IconName = task.IconName,
                Tags = task.Tags,
                CreatedAt = DateTime.UtcNow
            };

            await _taskRepository.CreateTask(newtask);
        }
        catch (Exception ex)
        {
            // Log or handle exception accordingly
            throw new Exception("Failed to create task", ex);
        }
    }

    public async Task<List<TaskItem>> GetAllTask(TaskQueryRequest query)
    {
        var builder = Builders<TaskItem>.Filter;
        var filters = new List<FilterDefinition<TaskItem>>();

        // Always filter only active tasks
        filters.Add(builder.Eq(x => x.IsActive, true));

        // UserId filter
        if (!string.IsNullOrEmpty(query.UserId))
        {
            filters.Add(builder.Eq(x => x.UserId, query.UserId));
        }

        // Status filter
        if (!string.IsNullOrEmpty(query.Status) && query.Status.ToLower() != "all")
        {
            filters.Add(builder.Eq(x => x.Status, query.Status));
        }

        // If date is provided, add basic date range filter (FromDate ≤ Date ≤ ToDate)
        if (query.Date.HasValue)
        {
            filters.Add(builder.Lte(x => x.FromDate, query.Date.Value));
            filters.Add(builder.Gte(x => x.ToDate, query.Date.Value));
        }

        var combinedFilter = filters.Count > 0 ? builder.And(filters) : builder.Empty;

        var allTasks = await _taskRepository.GetFilteredTasks(combinedFilter);

        // If no date is provided, return result as-is
        if (!query.Date.HasValue)
            return allTasks;

        // In-memory filter for repeat logic
        var filteredTasks = allTasks.Where(task =>
        {
            var date = query.Date.Value.Date;

            if (task.RepeatCycleType == "daily")
            {
                return true; // Already filtered by date range
            }

            if (task.RepeatCycleType == "custom" && task.CustomRepeatDays != null)
            {
                return task.CustomRepeatDays.Contains(date.DayOfWeek);
            }

            if (task.RepeatCycleType == "tts")
            {
                return false;
            }

            return false;
        }).ToList();

        return filteredTasks;
    }

    public async Task DeleteTask(string id)
    {
        try
        {
            await _taskRepository.DeleteTaskAsync(id);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to delete task", ex);
        }
    }

    public async Task<List<TaskItem>> GetUpcomingTasksAsync(DateTime date)
    {
        var response = await _taskRepository.GetUpcomingTasksAsync(date);
        return response;
    }
}

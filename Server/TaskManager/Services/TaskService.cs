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
    private readonly IUserRepository _userRepository;

    public TaskService(ITaskRepository taskRepository, IUserRepository userRepository)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
    }

    #region Basic Task Management

    public async Task CreateNewTask(string userId, TaskRequest task)
    {
        try
        {
            var newTask = new TaskItem
            {
                UserId = userId,
                Title = task.Title,
                Description = task.Description,
                StartTime = task.StartTime,
                EndTime = task.EndTime,
                RepeatCycleType = task.RepeatCycleType,
                CustomRepeatDays = task.CustomRepeatDays ?? new(),
                FromDate = task.FromDate,
                ToDate = task.ToDate,
                ColorHex = task.ColorHex,
                IconName = task.IconName,
                Priority = task.Priority,
                Category = task.Category,
                Tags = task.Tags ?? new(),
                EnableReminders = task.EnableReminders,
                ReminderMinutesBefore = task.ReminderMinutesBefore,
                IsTemplate = task.IsTemplate
            };

            await _taskRepository.CreateTask(newTask);

            // Update user statistics
            await _userRepository.IncrementTasksCreatedAsync(userId);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to create task", ex);
        }
    }

    public async Task<TaskItem?> GetTaskByIdAsync(string userId, string id)
    {
        var task = await _taskRepository.GetTaskByIdAsync(id);

        // Ensure user can only access their own tasks
        if (task == null || task.UserId != userId)
            return null;

        return task;
    }

    public async Task<bool> UpdateTaskAsync(string userId, string id, TaskRequest taskRequest)
    {
        try
        {
            var existingTask = await _taskRepository.GetTaskByIdAsync(id);
            if (existingTask == null || existingTask.UserId != userId)
                return false;

            // Update the task properties
            existingTask.Title = taskRequest.Title;
            existingTask.Description = taskRequest.Description;
            existingTask.StartTime = taskRequest.StartTime;
            existingTask.EndTime = taskRequest.EndTime;
            existingTask.RepeatCycleType = taskRequest.RepeatCycleType;
            existingTask.CustomRepeatDays = taskRequest.CustomRepeatDays ?? new();
            existingTask.FromDate = taskRequest.FromDate;
            existingTask.ToDate = taskRequest.ToDate;
            existingTask.ColorHex = taskRequest.ColorHex;
            existingTask.IconName = taskRequest.IconName;
            existingTask.Priority = taskRequest.Priority;
            existingTask.Category = taskRequest.Category;
            existingTask.Tags = taskRequest.Tags ?? new();
            existingTask.EnableReminders = taskRequest.EnableReminders;
            existingTask.ReminderMinutesBefore = taskRequest.ReminderMinutesBefore;

            return await _taskRepository.UpdateTaskAsync(existingTask);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to update task", ex);
        }
    }

    public async Task DeleteTask(string userId, string id)
    {
        try
        {
            var existingTask = await _taskRepository.GetTaskByIdAsync(id);
            if (existingTask == null || existingTask.UserId != userId)
                throw new UnauthorizedAccessException("Task not found or access denied");

            await _taskRepository.DeleteTaskAsync(id);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to delete task", ex);
        }
    }

    #endregion

    #region Query Operations

    public async Task<List<TaskItem>> GetAllTask(string userId, TaskQueryRequest query)
    {
        var builder = Builders<TaskItem>.Filter;
        var filters = new List<FilterDefinition<TaskItem>>();

        // Always filter by current user
        filters.Add(builder.Eq(x => x.UserId, userId));

        // Always filter only active tasks (unless specified otherwise)
        if (query.OnlyActiveTasks != false)
        {
            filters.Add(builder.Eq(x => x.IsActive, true));
        }

        // Priority filter
        if (!string.IsNullOrEmpty(query.Priority))
        {
            filters.Add(builder.Eq(x => x.Priority, query.Priority));
        }

        // Category filter
        if (!string.IsNullOrEmpty(query.Category))
        {
            filters.Add(builder.Eq(x => x.Category, query.Category));
        }

        // Tags filter
        if (query.Tags != null && query.Tags.Any())
        {
            filters.Add(builder.AnyIn(x => x.Tags, query.Tags));
        }

        // RepeatCycleType filter
        if (!string.IsNullOrEmpty(query.RepeatCycleType))
        {
            filters.Add(builder.Eq(x => x.RepeatCycleType, query.RepeatCycleType));
        }

        // Date range filter
        if (query.FromDate.HasValue && query.ToDate.HasValue)
        {
            filters.Add(builder.Gte(x => x.FromDate, query.FromDate.Value));
            filters.Add(builder.Lte(x => x.ToDate, query.ToDate.Value));
        }
        else if (query.Date.HasValue)
        {
            filters.Add(builder.Lte(x => x.FromDate, query.Date.Value));
            filters.Add(builder.Gte(x => x.ToDate, query.Date.Value));
        }

        var combinedFilter = filters.Count > 0 ? builder.And(filters) : builder.Empty;
        var allTasks = await _taskRepository.GetFilteredTasks(combinedFilter);

        // Apply status filtering based on execution records if specified
        if (!string.IsNullOrEmpty(query.Status) && query.Status != "All")
        {
            var targetDate = query.Date ?? DateTime.Today;
            var taskIds = allTasks.Select(t => t.Id).ToList();
            
            // Get execution records for these tasks on the target date
            var executions = new List<TaskExecutionRecord>();
            foreach (var taskId in taskIds)
            {
                var execution = await _taskRepository.GetTaskExecutionAsync(taskId, userId, targetDate);
                if (execution != null)
                {
                    executions.Add(execution);
                }
            }

            // Filter tasks based on execution status
            var filteredTaskIds = new HashSet<string>();
            switch (query.Status.ToLower())
            {
                case "completed":
                    filteredTaskIds = new HashSet<string>(executions.Where(e => e.Status == "Completed").Select(e => e.TaskId));
                    break;
                case "inprogress":
                    filteredTaskIds = new HashSet<string>(executions.Where(e => e.Status == "InProgress").Select(e => e.TaskId));
                    break;
                case "pending":
                    // Tasks without execution records or with NotStarted status
                    var executedTaskIds = new HashSet<string>(executions.Select(e => e.TaskId));
                    filteredTaskIds = new HashSet<string>(allTasks.Where(t => 
                        !executedTaskIds.Contains(t.Id) || 
                        executions.Any(e => e.TaskId == t.Id && e.Status == "NotStarted")
                    ).Select(t => t.Id));
                    break;
                case "skipped":
                    filteredTaskIds = new HashSet<string>(executions.Where(e => e.Status == "Skipped").Select(e => e.TaskId));
                    break;
            }

            allTasks = allTasks.Where(t => filteredTaskIds.Contains(t.Id)).ToList();
        }

        // Apply sorting
        allTasks = ApplySorting(allTasks, query.SortBy, query.SortOrder);

        // Apply pagination
        if (query.PageSize.HasValue && query.Page.HasValue)
        {
            var skip = (query.Page.Value - 1) * query.PageSize.Value;
            allTasks = allTasks.Skip(skip).Take(query.PageSize.Value).ToList();
        }

        return allTasks;
    }

    public async Task<List<TaskItem>> GetUpcomingTasksAsync(string userId, DateTime date)
    {
        var allTasks = await _taskRepository.GetUpcomingTasksAsync(date);
        // Filter by userId for security
        return allTasks.Where(t => t.UserId == userId).ToList();
    }

    public async Task<TaskDayResponse> GetTasksForDayAsync(string userId, DateTime date)
    {
        var tasks = await _taskRepository.GetTasksForDateAsync(userId, date);
        var response = new TaskDayResponse
        {
            Date = date.Date
        };

        foreach (var task in tasks)
        {
            var execution = await _taskRepository.GetTaskExecutionAsync(task.Id, userId, date);
            var taskWithExecution = new TaskItemWithExecution
            {
                Task = task,
                Execution = execution,
                CurrentStatus = execution?.Status ?? "NotStarted"
            };

            switch (taskWithExecution.CurrentStatus)
            {
                case "Completed":
                    response.CompletedTasks.Add(taskWithExecution);
                    break;
                case "InProgress":
                    response.InProgressTasks.Add(taskWithExecution);
                    break;
                case "Skipped":
                    response.SkippedTasks.Add(taskWithExecution);
                    break;
                default:
                    response.UpcomingTasks.Add(taskWithExecution);
                    break;
            }
        }

        // Calculate statistics
        response.Statistics = CalculateDayStatistics(response);

        return response;
    }

    public async Task<List<TaskItem>> GetTasksInRangeAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        return await _taskRepository.GetTasksInDateRangeAsync(userId, fromDate, toDate);
    }

    #endregion

    #region Task Execution and Completion

    public async Task<TaskExecutionRecord> StartTaskAsync(string userId, string taskId, DateTime executionDate)
    {
        var existingExecution = await _taskRepository.GetTaskExecutionAsync(taskId, userId, executionDate);

        if (existingExecution != null)
        {
            existingExecution.Status = "InProgress";
            existingExecution.ActualStartTime = DateTime.Now;
            await _taskRepository.UpdateTaskExecutionAsync(existingExecution);
            return existingExecution;
        }

        var task = await _taskRepository.GetTaskByIdAsync(taskId);
        if (task == null || task.UserId != userId)
            throw new ArgumentException("Task not found or access denied");

        var execution = new TaskExecutionRecord
        {
            TaskId = taskId,
            UserId = userId,
            ExecutionDate = executionDate.Date,
            ActualStartTime = DateTime.Now,
            ExpectedDurationMinutes = task.ExpectedDurationMinutes,
            Status = "InProgress"
        };

        await _taskRepository.CreateTaskExecution(execution);
        return execution;
    }

    public async Task<TaskExecutionRecord> CompleteTaskAsync(string userId, TaskCompletionRequest request)
    {
        var execution = await _taskRepository.GetTaskExecutionAsync(request.TaskId, userId, request.ExecutionDate);

        if (execution == null)
        {
            // Create new execution record
            var task = await _taskRepository.GetTaskByIdAsync(request.TaskId);
            if (task == null || task.UserId != userId)
                throw new ArgumentException("Task not found or access denied");

            execution = new TaskExecutionRecord
            {
                TaskId = request.TaskId,
                UserId = userId,
                ExecutionDate = request.ExecutionDate.Date,
                ExpectedDurationMinutes = task.ExpectedDurationMinutes
            };
        }
        execution.Status = "Completed";
        execution.ActualEndTime = DateTime.Now;
        execution.ActualDurationMinutes = request.ActualDurationMinutes;
        execution.CompletionPercentage = request.CompletionPercentage;
        execution.Notes = request.Notes;
        execution.IsManuallyMarked = request.IsManuallyMarked;

        if (execution.ActualStartTime.HasValue && execution.ActualEndTime.HasValue)
        {
            var actualDuration = (execution.ActualEndTime.Value - execution.ActualStartTime.Value).TotalMinutes;
            execution.EfficiencyScore = execution.ExpectedDurationMinutes > 0
                ? actualDuration / execution.ExpectedDurationMinutes
                : 1.0;
        }

        if (string.IsNullOrEmpty(execution.Id))
        {
            await _taskRepository.CreateTaskExecution(execution);
        }
        else
        {
            await _taskRepository.UpdateTaskExecutionAsync(execution);
        }

        // Update user and task statistics
        await _userRepository.IncrementTasksCompletedAsync(userId);
        await _userRepository.AddLoggedHoursAsync(userId, request.ActualDurationMinutes / 60.0);
        await UpdateTaskStatisticsAsync(request.TaskId);

        return execution;
    }

    public async Task<TaskExecutionRecord> UpdateTaskExecutionAsync(string userId, TaskExecutionRequest request)
    {
        var execution = await _taskRepository.GetTaskExecutionAsync(request.TaskId, userId, request.ExecutionDate);

        if (execution == null)
        {
            throw new ArgumentException("Task execution not found");
        }
        switch (request.Action.ToLower())
        {
            case "start":
                execution.Status = "InProgress";
                execution.ActualStartTime = DateTime.Now;
                break;
            case "pause":
                execution.Status = "Paused";
                break;
            case "resume":
                execution.Status = "InProgress";
                execution.InterruptionCount++;
                break;
            case "skip":
                execution.Status = "Skipped";
                execution.Notes = request.Notes;
                break;
            case "complete":
                execution.Status = "Completed";
                execution.ActualEndTime = DateTime.Now;
                execution.CompletionPercentage = request.CompletionPercentage ?? 100;
                break;
        }

        if (request.CompletionPercentage.HasValue)
        {
            execution.CompletionPercentage = request.CompletionPercentage.Value;
        }

        if (!string.IsNullOrEmpty(request.Notes))
        {
            execution.Notes = request.Notes;
        }

        await _taskRepository.UpdateTaskExecutionAsync(execution);
        return execution;
    }

    public async Task<List<TaskExecutionRecord>> GetExecutionHistoryAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        return await _taskRepository.GetUserExecutionHistoryAsync(userId, fromDate, toDate);
    }

    #endregion

    #region Analytics

    public async Task<TaskAnalyticsResponse> GetTaskAnalyticsAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        var executions = await _taskRepository.GetUserExecutionHistoryAsync(userId, fromDate, toDate);
        var tasks = await GetTasksInRangeAsync(userId, fromDate, toDate);

        var response = new TaskAnalyticsResponse
        {
            UserId = userId,
            FromDate = fromDate,
            ToDate = toDate
        };

        // Calculate basic statistics
        response.TotalTasksCreated = tasks.Count;
        response.TotalTasksCompleted = executions.Count(e => e.Status == "Completed");
        response.TotalTasksSkipped = executions.Count(e => e.Status == "Skipped");
        response.OverallCompletionRate = response.TotalTasksCreated > 0
            ? (double)response.TotalTasksCompleted / response.TotalTasksCreated * 100
            : 0;

        if (executions.Any())
        {
            response.AverageTaskDuration = executions
                .Where(e => e.ActualDurationMinutes > 0)
                .Average(e => e.ActualDurationMinutes);
        }

        // Calculate category statistics
        response.CategoryStats = tasks
            .Where(t => !string.IsNullOrEmpty(t.Category))
            .GroupBy(t => t.Category)
            .Select(g => new CategoryStats
            {
                Category = g.Key!,
                TaskCount = g.Count(),
                CompletedCount = executions.Count(e =>
                    g.Any(t => t.Id == e.TaskId) && e.Status == "Completed"),
                CompletionRate = g.Count() > 0
                    ? (double)executions.Count(e => g.Any(t => t.Id == e.TaskId) && e.Status == "Completed") / g.Count() * 100
                    : 0,
                AverageDuration = executions
                    .Where(e => g.Any(t => t.Id == e.TaskId) && e.ActualDurationMinutes > 0)
                    .DefaultIfEmpty()
                    .Average(e => e?.ActualDurationMinutes ?? 0)
            }).ToList();

        // Calculate daily statistics
        response.DailyStats = executions
            .GroupBy(e => e.ExecutionDate.Date)
            .Select(g => new DailyStats
            {
                Date = g.Key,
                TaskCount = g.Count(),
                CompletedCount = g.Count(e => e.Status == "Completed"),
                CompletionRate = g.Count() > 0 ? (double)g.Count(e => e.Status == "Completed") / g.Count() * 100 : 0,
                TotalMinutes = g.Sum(e => e.ActualDurationMinutes)
            }).OrderBy(d => d.Date).ToList();

        return response;
    }

    public async Task UpdateTaskStatisticsAsync(string taskId)
    {
        var executions = await _taskRepository.GetUserExecutionHistoryAsync("", DateTime.MinValue, DateTime.MaxValue);
        var taskExecutions = executions.Where(e => e.TaskId == taskId).ToList();

        if (!taskExecutions.Any()) return;

        var completions = taskExecutions.Count(e => e.Status == "Completed");
        var skips = taskExecutions.Count(e => e.Status == "Skipped");
        var avgTime = taskExecutions.Where(e => e.ActualDurationMinutes > 0).DefaultIfEmpty().Average(e => e?.ActualDurationMinutes ?? 0);
        var completionRate = taskExecutions.Count > 0 ? (double)completions / taskExecutions.Count * 100 : 0;

        await _taskRepository.UpdateTaskStatisticsAsync(taskId, completions, skips, avgTime, completionRate);
    }

    #endregion

    #region Helper Methods

    private List<TaskItem> ApplySorting(List<TaskItem> tasks, string? sortBy, string? sortOrder)
    {
        if (string.IsNullOrEmpty(sortBy)) return tasks;

        var isDescending = sortOrder?.ToUpper() == "DESC";

        return sortBy.ToLower() switch
        {
            "starttime" => isDescending
                ? tasks.OrderByDescending(t => t.StartTime).ToList()
                : tasks.OrderBy(t => t.StartTime).ToList(),
            "priority" => isDescending
                ? tasks.OrderByDescending(t => GetPriorityValue(t.Priority)).ToList()
                : tasks.OrderBy(t => GetPriorityValue(t.Priority)).ToList(),
            "createdat" => isDescending
                ? tasks.OrderByDescending(t => t.CreatedAt).ToList()
                : tasks.OrderBy(t => t.CreatedAt).ToList(),
            "title" => isDescending
                ? tasks.OrderByDescending(t => t.Title).ToList()
                : tasks.OrderBy(t => t.Title).ToList(),
            _ => tasks
        };
    }

    private int GetPriorityValue(string priority)
    {
        return priority.ToLower() switch
        {
            "low" => 1,
            "medium" => 2,
            "high" => 3,
            "critical" => 4,
            _ => 0
        };
    }

    private TaskDayStatistics CalculateDayStatistics(TaskDayResponse dayResponse)
    {
        var totalTasks = dayResponse.UpcomingTasks.Count + dayResponse.CompletedTasks.Count +
                        dayResponse.InProgressTasks.Count + dayResponse.SkippedTasks.Count;

        var overdueTasks = dayResponse.UpcomingTasks.Count(t => t.IsOverdue);

        var totalPlannedMinutes = dayResponse.UpcomingTasks.Sum(t => t.Task.ExpectedDurationMinutes) +
                                 dayResponse.CompletedTasks.Sum(t => t.Task.ExpectedDurationMinutes) +
                                 dayResponse.InProgressTasks.Sum(t => t.Task.ExpectedDurationMinutes) +
                                 dayResponse.SkippedTasks.Sum(t => t.Task.ExpectedDurationMinutes);

        var totalActualMinutes = dayResponse.CompletedTasks.Sum(t => t.Execution?.ActualDurationMinutes ?? 0) +
                                dayResponse.InProgressTasks.Sum(t => t.Execution?.ActualDurationMinutes ?? 0);

        return new TaskDayStatistics
        {
            TotalTasks = totalTasks,
            CompletedTasks = dayResponse.CompletedTasks.Count,
            PendingTasks = dayResponse.UpcomingTasks.Count,
            SkippedTasks = dayResponse.SkippedTasks.Count,
            OverdueTasks = overdueTasks,
            CompletionRate = totalTasks > 0 ? (double)dayResponse.CompletedTasks.Count / totalTasks * 100 : 0,
            TotalPlannedMinutes = totalPlannedMinutes,
            TotalActualMinutes = totalActualMinutes,
            ProductivityScore = totalPlannedMinutes > 0 ? (double)totalActualMinutes / totalPlannedMinutes * 100 : 0
        };
    }

    #endregion

    #region User Performance and Activity

    public async Task<UserPerformanceResponse> GetUserPerformanceAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("User not found");

        var executions = await _taskRepository.GetUserExecutionHistoryAsync(userId, fromDate, toDate);
        var tasks = await GetTasksInRangeAsync(userId, fromDate, toDate);

        var response = new UserPerformanceResponse
        {
            UserId = userId,
            UserName = user.Name,
            FromDate = fromDate,
            ToDate = toDate
        };

        // Calculate overall statistics
        response.TotalTasksAssigned = tasks.Count;
        response.TotalTasksCompleted = executions.Count(e => e.Status == "Completed");
        response.TotalTasksSkipped = executions.Count(e => e.Status == "Skipped");
        response.OverallCompletionRate = response.TotalTasksAssigned > 0
            ? (double)response.TotalTasksCompleted / response.TotalTasksAssigned * 100
            : 0;

        // Time management
        response.TotalHoursLogged = executions.Sum(e => e.ActualDurationMinutes) / 60.0;
        response.AverageTaskDuration = executions.Where(e => e.ActualDurationMinutes > 0)
            .DefaultIfEmpty().Average(e => e?.ActualDurationMinutes ?? 0);

        var completedExecutions = executions.Where(e => e.Status == "Completed" && e.ActualDurationMinutes > 0).ToList();
        response.EfficiencyScore = completedExecutions.Any()
            ? completedExecutions.Average(e => e.EfficiencyScore)
            : 0;

        // Consistency metrics
        var dailyStats = executions.GroupBy(e => e.ExecutionDate.Date)
            .Select(g => new DailyPerformance
            {
                Date = g.Key,
                TasksAssigned = tasks.Count(t => IsTaskScheduledForDate(t, g.Key)),
                TasksCompleted = g.Count(e => e.Status == "Completed"),
                CompletionRate = g.Count() > 0 ? (double)g.Count(e => e.Status == "Completed") / g.Count() * 100 : 0,
                HoursLogged = g.Sum(e => e.ActualDurationMinutes) / 60.0,
                EfficiencyScore = g.Where(e => e.EfficiencyScore > 0).DefaultIfEmpty().Average(e => e?.EfficiencyScore ?? 0)
            }).ToList();

        response.DailyPerformances = dailyStats;
        response.ConsecutiveDaysActive = CalculateConsecutiveDays(dailyStats);
        response.DaysWithAllTasksCompleted = dailyStats.Count(d => d.CompletionRate >= 100);

        // Category performance
        response.CategoryPerformances = tasks
            .Where(t => !string.IsNullOrEmpty(t.Category))
            .GroupBy(t => t.Category)
            .Select(g => new CategoryPerformance
            {
                Category = g.Key!,
                TasksAssigned = g.Count(),
                TasksCompleted = executions.Count(e => g.Any(t => t.Id == e.TaskId) && e.Status == "Completed"),
                CompletionRate = g.Count() > 0
                    ? (double)executions.Count(e => g.Any(t => t.Id == e.TaskId) && e.Status == "Completed") / g.Count() * 100
                    : 0,
                AverageDuration = executions
                    .Where(e => g.Any(t => t.Id == e.TaskId) && e.ActualDurationMinutes > 0)
                    .DefaultIfEmpty().Average(e => e?.ActualDurationMinutes ?? 0)
            }).ToList();

        return response;
    }

    public async Task<List<TopPerformerResponse>> GetTopPerformersAsync(DateTime fromDate, DateTime toDate, int limit = 10)
    {
        var allUsers = await _userRepository.GetAllUsersAsync();
        var topPerformers = new List<TopPerformerResponse>();

        foreach (var user in allUsers)
        {
            var executions = await _taskRepository.GetUserExecutionHistoryAsync(user.Id, fromDate, toDate);
            var tasks = await GetTasksInRangeAsync(user.Id, fromDate, toDate);

            if (!tasks.Any()) continue;

            var completedTasks = executions.Count(e => e.Status == "Completed");
            var completionRate = (double)completedTasks / tasks.Count * 100;
            var totalHours = executions.Sum(e => e.ActualDurationMinutes) / 60.0;
            var efficiencyScore = executions.Where(e => e.EfficiencyScore > 0).DefaultIfEmpty().Average(e => e?.EfficiencyScore ?? 0);

            var dailyActivity = executions.GroupBy(e => e.ExecutionDate.Date).Count();

            topPerformers.Add(new TopPerformerResponse
            {
                UserId = user.Id,
                UserName = user.Name,
                CompletionRate = completionRate,
                TotalTasksCompleted = completedTasks,
                TotalHoursLogged = totalHours,
                EfficiencyScore = efficiencyScore,
                ConsecutiveDaysActive = dailyActivity
            });
        }

        return topPerformers.OrderByDescending(tp => tp.CompletionRate)
            .ThenByDescending(tp => tp.TotalTasksCompleted)
            .Take(limit)
            .Select((tp, index) =>
            {
                tp.Rank = index + 1;
                tp.PerformanceLevel = CalculatePerformanceLevel(tp.CompletionRate, tp.EfficiencyScore);
                return tp;
            }).ToList();
    }

    public async Task<UserActivityResponse> GetUserActivityAsync(string userId, DateTime fromDate, DateTime toDate)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("User not found");

        var executions = await _taskRepository.GetUserExecutionHistoryAsync(userId, fromDate, toDate);

        var response = new UserActivityResponse
        {
            UserId = userId,
            UserName = user.Name,
            FromDate = fromDate,
            ToDate = toDate
        };

        // Activity metrics
        var activeDays = executions.GroupBy(e => e.ExecutionDate.Date).ToList();
        response.TotalActiveDays = activeDays.Count;
        response.LastActiveDate = executions.Any() ? executions.Max(e => e.ExecutionDate) : DateTime.MinValue;

        // Activity heatmap
        response.ActivityHeatmap = activeDays.Select(g => new ActivityHeatmap
        {
            Date = g.Key,
            TasksCompleted = g.Count(e => e.Status == "Completed"),
            IntensityLevel = Math.Min(1.0, g.Count(e => e.Status == "Completed") / 10.0) // Scale 0-1
        }).ToList();

        // Time distribution
        response.HourlyDistribution = executions
            .Where(e => e.ActualStartTime.HasValue)
            .GroupBy(e => e.ActualStartTime!.Value.Hour)
            .Select(g => new HourlyActivity
            {
                Hour = g.Key,
                TasksCompleted = g.Count(e => e.Status == "Completed"),
                AverageEfficiency = g.Where(e => e.EfficiencyScore > 0).DefaultIfEmpty().Average(e => e?.EfficiencyScore ?? 0)
            }).ToList();

        response.WeeklyDistribution = executions
            .GroupBy(e => e.ExecutionDate.DayOfWeek)
            .Select(g => new DayOfWeekActivity
            {
                DayOfWeek = g.Key,
                TasksCompleted = g.Count(e => e.Status == "Completed"),
                AverageCompletionRate = g.Count() > 0 ? (double)g.Count(e => e.Status == "Completed") / g.Count() * 100 : 0
            }).ToList();

        // Recent activities
        response.RecentActivities = executions
            .OrderByDescending(e => e.CreatedAt)
            .Take(20)
            .Select(e => new RecentActivity
            {
                Timestamp = e.CreatedAt,
                ActivityType = GetActivityType(e.Status),
                TaskTitle = GetTaskTitle(e.TaskId).Result,
                Notes = e.Notes
            }).ToList();

        // Calculate streaks
        var consecutiveDays = CalculateStreaks(activeDays.Select(g => g.Key).OrderBy(d => d).ToList());
        response.CurrentStreak = consecutiveDays.currentStreak;
        response.LongestStreak = consecutiveDays.longestStreak;

        return response;
    }

    public async Task<LeaderboardResponse> GetDailyGoalLeaderboardAsync(DateTime date, int limit = 10)
    {
        var allUsers = await _userRepository.GetAllUsersAsync();
        var leaderboardEntries = new List<LeaderboardEntry>();

        foreach (var user in allUsers)
        {
            var dayResponse = await GetTasksForDayAsync(user.Id, date);

            var tasksAssigned = dayResponse.Statistics.TotalTasks;
            var tasksCompleted = dayResponse.Statistics.CompletedTasks;
            var completionRate = dayResponse.Statistics.CompletionRate;
            var hoursLogged = dayResponse.Statistics.TotalActualMinutes / 60.0;
            var achievedGoal = completionRate >= 80; // Goal is 80% completion rate

            leaderboardEntries.Add(new LeaderboardEntry
            {
                UserId = user.Id,
                UserName = user.Name,
                TasksAssigned = tasksAssigned,
                TasksCompleted = tasksCompleted,
                CompletionRate = completionRate,
                HoursLogged = hoursLogged,
                AchievedDailyGoal = achievedGoal,
                Badge = GetBadge(completionRate)
            });
        }

        var sortedEntries = leaderboardEntries
            .OrderByDescending(e => e.CompletionRate)
            .ThenByDescending(e => e.TasksCompleted)
            .Take(limit)
            .Select((entry, index) =>
            {
                entry.Rank = index + 1;
                return entry;
            }).ToList();

        var stats = new LeaderboardStats
        {
            TotalParticipants = leaderboardEntries.Count,
            AverageCompletionRate = leaderboardEntries.Any() ? leaderboardEntries.Average(e => e.CompletionRate) : 0,
            UsersWhoAchievedGoals = leaderboardEntries.Count(e => e.AchievedDailyGoal),
            GoalAchievementRate = leaderboardEntries.Any()
                ? (double)leaderboardEntries.Count(e => e.AchievedDailyGoal) / leaderboardEntries.Count * 100
                : 0
        };

        return new LeaderboardResponse
        {
            Date = date,
            Entries = sortedEntries,
            Statistics = stats
        };
    }

    #endregion

    #region Helper Methods for Performance

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

    private int CalculateConsecutiveDays(List<DailyPerformance> dailyStats)
    {
        if (!dailyStats.Any()) return 0;

        var sortedDays = dailyStats.OrderByDescending(d => d.Date).ToList();
        var consecutiveDays = 0;
        var currentDate = DateTime.Today;

        foreach (var day in sortedDays)
        {
            if (day.Date.Date == currentDate.Date && day.TasksCompleted > 0)
            {
                consecutiveDays++;
                currentDate = currentDate.AddDays(-1);
            }
            else
            {
                break;
            }
        }

        return consecutiveDays;
    }

    private string CalculatePerformanceLevel(double completionRate, double efficiencyScore)
    {
        var averageScore = (completionRate + efficiencyScore * 100) / 2;

        return averageScore switch
        {
            >= 90 => "Expert",
            >= 75 => "Advanced",
            >= 60 => "Intermediate",
            _ => "Beginner"
        };
    }

    private string GetActivityType(string status)
    {
        return status switch
        {
            "Completed" => "TaskCompleted",
            "InProgress" => "TaskStarted",
            "Skipped" => "TaskSkipped",
            _ => "TaskUpdated"
        };
    }

    private async Task<string> GetTaskTitle(string taskId)
    {
        var task = await _taskRepository.GetTaskByIdAsync(taskId);
        return task?.Title ?? "Unknown Task";
    }

    private (int currentStreak, int longestStreak) CalculateStreaks(List<DateTime> activeDays)
    {
        if (!activeDays.Any()) return (0, 0);

        var currentStreak = 0;
        var longestStreak = 0;
        var tempStreak = 1;

        for (int i = activeDays.Count - 1; i >= 0; i--)
        {
            if (i == activeDays.Count - 1)
            {
                if (activeDays[i].Date == DateTime.Today.Date || activeDays[i].Date == DateTime.Today.AddDays(-1).Date)
                {
                    currentStreak = 1;
                }
                continue;
            }

            if (activeDays[i].Date == activeDays[i + 1].Date.AddDays(-1))
            {
                tempStreak++;
                if (i == activeDays.Count - 2 || activeDays[i + 1].Date <= DateTime.Today.Date)
                {
                    currentStreak = tempStreak;
                }
            }
            else
            {
                longestStreak = Math.Max(longestStreak, tempStreak);
                tempStreak = 1;
                if (currentStreak == 0 && activeDays[i].Date == DateTime.Today.Date)
                {
                    currentStreak = 1;
                }
            }
        }

        longestStreak = Math.Max(longestStreak, tempStreak);
        return (currentStreak, longestStreak);
    }

    private string GetBadge(double completionRate)
    {
        return completionRate switch
        {
            >= 95 => "🥇 Gold",
            >= 85 => "🥈 Silver",
            >= 70 => "🥉 Bronze",
            _ => "🎯 Participant"
        };
    }

    #endregion
}

using System;

namespace TaskManager.Models.Response;

public class TaskDayResponse
{
    public DateTime Date { get; set; }
    public List<TaskItemWithExecution> UpcomingTasks { get; set; } = new();
    public List<TaskItemWithExecution> CompletedTasks { get; set; } = new();
    public List<TaskItemWithExecution> InProgressTasks { get; set; } = new();
    public List<TaskItemWithExecution> SkippedTasks { get; set; } = new();
    public TaskDayStatistics Statistics { get; set; } = new();
}

public class TaskItemWithExecution
{
    public TaskItem Task { get; set; } = new();
    public TaskExecutionRecord? Execution { get; set; }
    public string CurrentStatus { get; set; } = "NotStarted"; // NotStarted, InProgress, Completed, Skipped
    public bool IsOverdue => Task.StartTime != null && DateTime.Now > ParseTaskDateTime(Task.StartTime) && CurrentStatus == "NotStarted";

    private DateTime ParseTaskDateTime(string timeStr)
    {
        if (TimeSpan.TryParse(timeStr, out var time))
        {
            return DateTime.Today.Add(time);
        }
        return DateTime.Today;
    }
}

public class TaskDayStatistics
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
    public int SkippedTasks { get; set; }
    public int OverdueTasks { get; set; }
    public double CompletionRate { get; set; } // Percentage
    public int TotalPlannedMinutes { get; set; }
    public int TotalActualMinutes { get; set; }
    public double ProductivityScore { get; set; } // ActualTime vs PlannedTime efficiency
}

public class TaskAnalyticsResponse
{
    public string UserId { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int TotalTasksCreated { get; set; }
    public int TotalTasksCompleted { get; set; }
    public int TotalTasksSkipped { get; set; }
    public double OverallCompletionRate { get; set; }
    public double AverageTaskDuration { get; set; }
    public List<CategoryStats> CategoryStats { get; set; } = new();
    public List<DailyStats> DailyStats { get; set; } = new();
    public List<string> MostProductiveDays { get; set; } = new();
    public List<string> MostProductiveTimeSlots { get; set; } = new();
}

public class CategoryStats
{
    public string Category { get; set; } = string.Empty;
    public int TaskCount { get; set; }
    public int CompletedCount { get; set; }
    public double CompletionRate { get; set; }
    public double AverageDuration { get; set; }
}

public class DailyStats
{
    public DateTime Date { get; set; }
    public int TaskCount { get; set; }
    public int CompletedCount { get; set; }
    public double CompletionRate { get; set; }
    public int TotalMinutes { get; set; }
}

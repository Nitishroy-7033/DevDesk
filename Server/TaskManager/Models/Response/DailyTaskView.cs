using System;

namespace TaskManager.Models.Response;

public class DailyTaskView
{
    public DateTime Date { get; set; }
    public List<TaskItem> UpcomingTasks { get; set; } = new();
    public List<TaskHistory> HistoryTasks { get; set; } = new();
}

using System;

namespace TaskManager.Models;

public class TaskQueryRequest
{
    public string? UserId { get; set; }
    public string? Status { get; set; } = "All"; // All, Pending, Completed, InProgress, Skipped
    public DateTime? Date { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? Priority { get; set; } // Low, Medium, High, Critical
    public string? Category { get; set; }
    public List<string>? Tags { get; set; }
    public string? RepeatCycleType { get; set; }
    public bool? IncludeCompleted { get; set; } = true;
    public bool? IncludeUpcoming { get; set; } = true;
    public bool? OnlyActiveTasks { get; set; } = true;
    public string? SortBy { get; set; } = "StartTime"; // StartTime, Priority, CreatedAt, Title
    public string? SortOrder { get; set; } = "ASC"; // ASC, DESC
    public int? PageSize { get; set; }
    public int? Page { get; set; }
}

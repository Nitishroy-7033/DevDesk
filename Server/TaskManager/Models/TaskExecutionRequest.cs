using System;

namespace TaskManager.Models;

public class TaskExecutionRequest
{
    public string TaskId { get; set; } = string.Empty;
    public DateTime ExecutionDate { get; set; }
    public string Action { get; set; } = string.Empty; // start, pause, resume, complete, skip
    public int? CompletionPercentage { get; set; } // 0-100
    public string? Notes { get; set; }
    public int? ActualDurationMinutes { get; set; } // For manual completion
}

public class TaskCompletionRequest
{
    public string TaskId { get; set; } = string.Empty;
    public DateTime ExecutionDate { get; set; }
    public DateTime? ActualStartTime { get; set; }
    public DateTime? ActualEndTime { get; set; }
    public int ActualDurationMinutes { get; set; }
    public int CompletionPercentage { get; set; } = 100;
    public string? Notes { get; set; }
}

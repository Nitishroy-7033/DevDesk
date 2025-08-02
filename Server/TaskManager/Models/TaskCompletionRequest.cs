using System;

namespace TaskManager.Models;

public class TaskCompletionRequest
{
    public string TaskId { get; set; } = string.Empty;
    public DateTime CompletionDate { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; } = null;
    public string CompletionType { get; set; } = "manual"; // Default to manual completion
}

using System;

namespace TaskManager.Models;

public class CompletedTask : TaskItem
{
    public string Status { get; set; }
    public DateTime WhenStartedTime { get; set; }
    public DateTime WhenCompletedTime { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public string CompletionType { get; set; }
    public string Notes { get; set; }
}

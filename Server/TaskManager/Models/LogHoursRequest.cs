using System;

namespace TaskManager.Models;

public class LogHoursRequest
{
    public string? TaskId { get; set; } // Optional - for task-specific logging
    public double Hours { get; set; }
    public DateTime? Date { get; set; } // Optional - defaults to today
    public string? Notes { get; set; }
    public string? Category { get; set; } // Work, Study, etc.
}

using System;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class TaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Time in HH:mm format (24-hour)
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;

    // Repeat configuration
    public string RepeatCycleType { get; set; } = "daily"; // daily, weekly, custom, none
    public List<DayOfWeek>? CustomRepeatDays { get; set; } = new();

    // Date range
    public DateTime FromDate { get; set; } = DateTime.Today;
    public DateTime ToDate { get; set; } = DateTime.Today.AddDays(30);

    // UI and categorization
    public string? ColorHex { get; set; } = "#4CAF50";
    public string? IconName { get; set; } = "task";
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical
    public string? Category { get; set; }
    public List<string>? Tags { get; set; } = new();

    // Reminders
    public bool EnableReminders { get; set; } = true;
    public int ReminderMinutesBefore { get; set; } = 15;

    // Advanced features
    public bool IsTemplate { get; set; } = false;
}

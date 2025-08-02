using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class CompletedTask
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;  // Reference to the user
    public string TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Time format: "HH:mm" (24-hour format)
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;

    // Calculate expected duration in minutes
    public int ExpectedDurationMinutes => CalculateDurationMinutes(StartTime, EndTime);

    // Repeat configuration
    public string RepeatCycleType { get; set; } = "daily"; // daily, weekly, custom, none
    public List<DayOfWeek> CustomRepeatDays { get; set; } = new();

    // Date range for the task
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime FromDate { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ToDate { get; set; }

    // UI customization
    public string? ColorHex { get; set; } = "#4CAF50";
    public string? IconName { get; set; } = "task";

    // Task status and priority
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical
    public bool IsActive { get; set; } = true;
    public bool IsTemplate { get; set; } = false; // If this is a template for creating other tasks

    // Categorization
    public List<string> Tags { get; set; } = new();
    public string? Category { get; set; } // Work, Personal, Health, Learning, etc.

    // Reminders and notifications
    public bool EnableReminders { get; set; } = true;
    public int ReminderMinutesBefore { get; set; } = 15; // Remind X minutes before start time

    // Tracking and analytics
    public int TotalCompletions { get; set; } = 0;
    public int TotalSkips { get; set; } = 0;
    public double AverageCompletionTime { get; set; } = 0; // In minutes
    public double CompletionRate { get; set; } = 0; // Percentage (0-100)

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Helper method to calculate duration
    private int CalculateDurationMinutes(string startTime, string endTime)
    {
        if (string.IsNullOrEmpty(startTime) || string.IsNullOrEmpty(endTime))
            return 0;

        try
        {
            var start = TimeSpan.Parse(startTime);
            var end = TimeSpan.Parse(endTime);

            // Handle overnight tasks (e.g., 23:00 to 01:00)
            if (end < start)
                end = end.Add(TimeSpan.FromDays(1));

            return (int)(end - start).TotalMinutes;
        }
        catch
        {
            return 0;
        }
    }
    public string Status { get; set; }
    public DateTime WhenStartedTime { get; set; }
    public DateTime WhenCompletedTime { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public string CompletionType { get; set; }
    public string Notes { get; set; }
}

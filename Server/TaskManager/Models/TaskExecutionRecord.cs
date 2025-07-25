using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class TaskExecutionRecord
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string TaskId { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ExecutionDate { get; set; } // The date this task was executed

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? ActualStartTime { get; set; } // When user actually started

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime? ActualEndTime { get; set; } // When user actually ended

    public int ActualDurationMinutes { get; set; } // How long user actually worked

    public int ExpectedDurationMinutes { get; set; } // How long it should have taken

    public string Status { get; set; } = "NotStarted"; // NotStarted, InProgress, Completed, Skipped, Paused

    public int CompletionPercentage { get; set; } = 0; // 0-100, how much of the task was completed

    public string? Notes { get; set; } // User notes about the execution

    public bool IsManuallyMarked { get; set; } = false; // If user manually marked as complete

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Productivity metrics
    public double EfficiencyScore { get; set; } = 0; // ActualTime vs ExpectedTime ratio
    public int InterruptionCount { get; set; } = 0; // How many times task was paused/resumed
}

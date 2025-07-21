using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class TaskHistory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string TaskId { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime Date { get; set; } // For which day the history is recorded
    public string Status { get; set; } = "NotStarted"; // InProgress | Completed | Skiped | 
    public string TaskTitle { get; set; }
    public DateTime StartTime { get; set; }  // e.g., 10:00 PM
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime EndTime { get; set; }    // e.g., 12:00 AM
    // RepeatCycleType: "daily", "tts", "custom"
    public string RepeatCycleType { get; set; }
    // For "custom" cycle: store specific repeat days (like Mon, Wed, Fri)
    public List<DayOfWeek> CustomRepeatDays { get; set; } = new();
    // Repeat from this date
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime FromDate { get; set; }
    // Repeat until this date
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ToDate { get; set; }
    // Expected duration in minutes (calculated from task start/end time)
    public int ExpectedDurationMinutes { get; set; }
    // Actual duration in minutes (set by user or timer tracking)
    public int ActualDurationMinutes { get; set; } = 0;
    // Whether user manually marked this as complete
    public bool MarkedAsComplete { get; set; } = false;
    public string? Notes { get; set; } // Optional notes like “interrupted by call”
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}

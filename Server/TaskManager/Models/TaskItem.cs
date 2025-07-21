using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class TaskItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string UserId { get; set; }  // Reference to the user
    public string Title { get; set; }
    public string? Description { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string RepeatCycleType { get; set; }
    // For "custom" cycle: store specific repeat days (like Mon, Wed, Fri)
    public List<DayOfWeek> CustomRepeatDays { get; set; } = new();
    // Repeat from this date
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime FromDate { get; set; }
    // Repeat until this date
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ToDate { get; set; }
    public string? ColorHex { get; set; }  // For UI (e.g., "#FF5733")
    public string? IconName { get; set; }  // e.g., "book", "run", "code"
    public string? Status { get; set; }  // e.g., "book", "run", "code"
    public bool IsActive { get; set; } = true;
    // Optional: Tags or categories (e.g., Health, Work, Learning)
    public List<string> Tags { get; set; } = new();
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

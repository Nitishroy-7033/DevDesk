using System;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class TaskRequest
{
    public string UserId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string? RepeatCycleType { get; set; } = "Daily";
    public List<DayOfWeek>? CustomRepeatDays { get; set; } = new();
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? ColorHex { get; set; }
    public string? IconName { get; set; }
    public List<string>? Tags { get; set; } = new();
}

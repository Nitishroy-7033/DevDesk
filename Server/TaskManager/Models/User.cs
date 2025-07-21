using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Role { get; set; } = "user";
    public string UserName { get; set; }
    public string Phone { get; set; }
    public string Name { get; set; }
    public string? Email { get; set; }
    public string PasswordHash { get; set; }
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // Optional: Track user productivity stats
    public int TotalTasksCreated { get; set; } = 0;
    public int TotalTasksCompleted { get; set; } = 0;
    public double TotalHoursLogged { get; set; } = 0;
    // Optional: Settings for UI personalization, reminder time etc.
    public UserPreferences Preferences { get; set; } = new();
}

public class UserPreferences
{
    public string Theme { get; set; } = "light"; // or dark
    public string DefaultTaskColor { get; set; } = "#4CAF50"; // green
    public TimeSpan DailyReminderTime { get; set; } = new TimeSpan(21, 0, 0); // 9:00 PM
}
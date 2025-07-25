using System;

namespace TaskManager.Models.Response;

public class UserPerformanceResponse
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }

    // Overall Statistics
    public int TotalTasksAssigned { get; set; }
    public int TotalTasksCompleted { get; set; }
    public int TotalTasksSkipped { get; set; }
    public double OverallCompletionRate { get; set; }

    // Time Management
    public double TotalHoursLogged { get; set; }
    public double AverageTaskDuration { get; set; }
    public double EfficiencyScore { get; set; } // Actual vs Expected time ratio

    // Consistency Metrics
    public int ConsecutiveDaysActive { get; set; }
    public int DaysWithAllTasksCompleted { get; set; }
    public double DailyGoalAchievementRate { get; set; }

    // Performance Trends
    public List<DailyPerformance> DailyPerformances { get; set; } = new();
    public List<CategoryPerformance> CategoryPerformances { get; set; } = new();

    // Rankings
    public int GlobalRank { get; set; }
    public string PerformanceLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced, Expert
}

public class DailyPerformance
{
    public DateTime Date { get; set; }
    public int TasksAssigned { get; set; }
    public int TasksCompleted { get; set; }
    public double CompletionRate { get; set; }
    public double HoursLogged { get; set; }
    public double EfficiencyScore { get; set; }
}

public class CategoryPerformance
{
    public string Category { get; set; } = string.Empty;
    public int TasksAssigned { get; set; }
    public int TasksCompleted { get; set; }
    public double CompletionRate { get; set; }
    public double AverageDuration { get; set; }
}

public class TopPerformerResponse
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public double CompletionRate { get; set; }
    public int TotalTasksCompleted { get; set; }
    public double TotalHoursLogged { get; set; }
    public double EfficiencyScore { get; set; }
    public int ConsecutiveDaysActive { get; set; }
    public int Rank { get; set; }
    public string PerformanceLevel { get; set; } = string.Empty;
}

public class UserActivityResponse
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }

    // Activity Metrics
    public int TotalActiveDays { get; set; }
    public DateTime LastActiveDate { get; set; }
    public List<ActivityHeatmap> ActivityHeatmap { get; set; } = new();

    // Time Distribution
    public List<HourlyActivity> HourlyDistribution { get; set; } = new();
    public List<DayOfWeekActivity> WeeklyDistribution { get; set; } = new();

    // Recent Activities
    public List<RecentActivity> RecentActivities { get; set; } = new();

    // Streaks
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime LastStreakDate { get; set; }
}

public class ActivityHeatmap
{
    public DateTime Date { get; set; }
    public int TasksCompleted { get; set; }
    public double IntensityLevel { get; set; } // 0-1 scale for visualization
}

public class HourlyActivity
{
    public int Hour { get; set; }
    public int TasksCompleted { get; set; }
    public double AverageEfficiency { get; set; }
}

public class DayOfWeekActivity
{
    public DayOfWeek DayOfWeek { get; set; }
    public int TasksCompleted { get; set; }
    public double AverageCompletionRate { get; set; }
}

public class RecentActivity
{
    public DateTime Timestamp { get; set; }
    public string ActivityType { get; set; } = string.Empty; // TaskCompleted, TaskStarted, TaskSkipped
    public string TaskTitle { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class LeaderboardResponse
{
    public DateTime Date { get; set; }
    public List<LeaderboardEntry> Entries { get; set; } = new();
    public LeaderboardStats Statistics { get; set; } = new();
}

public class LeaderboardEntry
{
    public int Rank { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public int TasksCompleted { get; set; }
    public int TasksAssigned { get; set; }
    public double CompletionRate { get; set; }
    public double HoursLogged { get; set; }
    public string Badge { get; set; } = string.Empty; // Gold, Silver, Bronze, etc.
    public bool AchievedDailyGoal { get; set; }
}

public class LeaderboardStats
{
    public int TotalParticipants { get; set; }
    public double AverageCompletionRate { get; set; }
    public int UsersWhoAchievedGoals { get; set; }
    public double GoalAchievementRate { get; set; }
}

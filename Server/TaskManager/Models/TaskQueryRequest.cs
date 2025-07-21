using System;

namespace TaskManager.Models;

public class TaskQueryRequest
{
    public string? UserId { get; set; }
    public string? Status { get; set; } = "All";
    public DateTime? Date { get; set; }
}

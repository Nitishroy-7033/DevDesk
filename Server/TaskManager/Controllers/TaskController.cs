using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Models;
using TaskManager.Models.Response;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : BaseController
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        #region Basic Task Management

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _taskService.CreateNewTask(userId, request);
                return Ok(new { message = "Task created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(string id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var task = await _taskService.GetTaskByIdAsync(userId, id);
                if (task == null)
                    return NotFound(new { message = "Task not found" });

                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(string id, [FromBody] TaskRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updated = await _taskService.UpdateTaskAsync(userId, id, request);
                if (!updated)
                    return NotFound(new { message = "Task not found" });

                return Ok(new { message = "Task updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(string id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _taskService.DeleteTask(userId, id);
                return Ok(new { message = "Task deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Query Operations

        [HttpPost("search")]
        public async Task<IActionResult> GetTasks([FromBody] TaskQueryRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var tasks = await _taskService.GetAllTask(userId, request);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTasks([FromQuery] TaskQueryRequest query)
        {
            try
            {
                var userId = GetCurrentUserId();
                var tasks = await _taskService.GetAllTask(userId, query);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("upcoming-task")]
        public async Task<IActionResult> GetUpcomingTasks([FromQuery] string? date = null)
        {
            try
            {
                var userId = GetCurrentUserId();

                // Parse date parameter (expecting YYYY-MM-DD format)
                DateTime targetDate = DateTime.Today;
                if (!string.IsNullOrEmpty(date))
                {
                    if (!DateTime.TryParse(date, out targetDate))
                    {
                        return BadRequest(new { message = "Invalid date format. Use YYYY-MM-DD." });
                    }
                }

                var tasks = await _taskService.GetUpcomingTasksAsync(userId, targetDate);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingTasks([FromQuery] DateTime? date = null, [FromQuery] string? status = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var targetDate = date ?? DateTime.Today;

                // If status filter is provided, use the filtered method
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    var query = new TaskQueryRequest
                    {
                        Date = targetDate,
                        Status = status,
                        OnlyActiveTasks = true
                    };
                    var filteredTasks = await _taskService.GetAllTask(userId, query);
                    return Ok(filteredTasks);
                }

                var tasks = await _taskService.GetUpcomingTasksAsync(userId, targetDate);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("day")]
        public async Task<IActionResult> GetTasksForDay([FromQuery] DateTime? date = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var targetDate = date ?? DateTime.Today;
                var response = await _taskService.GetTasksForDayAsync(userId, targetDate);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("range")]
        public async Task<IActionResult> GetTasksInRange(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            try
            {
                var userId = GetCurrentUserId();
                var tasks = await _taskService.GetTasksInRangeAsync(userId, fromDate, toDate);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Task Execution

        [HttpPost("start")]
        public async Task<IActionResult> StartTask([FromBody] TaskExecutionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var execution = await _taskService.StartTaskAsync(userId, request.TaskId, request.ExecutionDate);
                return Ok(execution);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("complete")]
        public async Task<IActionResult> CompleteTask([FromBody] TaskCompletionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var execution = await _taskService.CompleteTaskAsync(userId, request);
                return Ok(execution);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("update-execution")]
        public async Task<IActionResult> UpdateTaskExecution([FromBody] TaskExecutionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var execution = await _taskService.UpdateTaskExecutionAsync(userId, request);
                return Ok(execution);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteTask([FromBody] TaskExecutionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var execution = await _taskService.UpdateTaskExecutionAsync(userId, request);
                return Ok(new { message = "Task execution updated successfully", execution });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("log-hours")]
        public async Task<IActionResult> LogHours([FromBody] LogHoursRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();

                // If task-specific, log to task execution
                if (!string.IsNullOrEmpty(request.TaskId))
                {
                    int totalMinutes = (int)(request.Hours * 60);
                    int hoursOnly = totalMinutes / 60;
                    int minutesOnly = totalMinutes % 60;

                    var executionRequest = new TaskExecutionRequest
                    {
                        TaskId = request.TaskId,
                        ExecutionDate = request.Date?.Date ?? DateTime.Today, // removes time part
                        Action = "log-hours",
                        ActualDurationMinutes = totalMinutes,
                        Notes = request.Notes
                    };

                    await _taskService.UpdateTaskExecutionAsync(userId, executionRequest);
                }


                return Ok(new { message = "Hours logged successfully", hours = request.Hours });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetTaskHistory(string userId, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var currentUserId = GetCurrentUserId();

                // Only allow users to access their own history
                if (userId != currentUserId)
                {
                    return Forbid();
                }

                var from = fromDate ?? DateTime.Today.AddDays(-30);
                var to = toDate ?? DateTime.Today;

                var history = await _taskService.GetExecutionHistoryAsync(userId, from, to);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("execution-history")]
        public async Task<IActionResult> GetExecutionHistory(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            try
            {
                var userId = GetCurrentUserId();
                var history = await _taskService.GetExecutionHistoryAsync(userId, fromDate, toDate);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Analytics

        [HttpGet("analytics")]
        public async Task<IActionResult> GetTaskAnalytics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var from = fromDate ?? DateTime.Today.AddDays(-30);
                var to = toDate ?? DateTime.Today;

                var analytics = await _taskService.GetTaskAnalyticsAsync(userId, from, to);
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region User Performance and Activity

        [HttpGet("performance")]
        public async Task<IActionResult> GetUserPerformance(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var from = fromDate ?? DateTime.Today.AddDays(-30);
                var to = toDate ?? DateTime.Today;

                var performance = await _taskService.GetUserPerformanceAsync(userId, from, to);
                return Ok(performance);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("activity")]
        public async Task<IActionResult> GetUserActivity(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var from = fromDate ?? DateTime.Today.AddDays(-30);
                var to = toDate ?? DateTime.Today;

                var activity = await _taskService.GetUserActivityAsync(userId, from, to);
                return Ok(activity);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("top-performers")]
        public async Task<IActionResult> GetTopPerformers(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int limit = 10)
        {
            try
            {
                var from = fromDate ?? DateTime.Today.AddDays(-30);
                var to = toDate ?? DateTime.Today;

                var topPerformers = await _taskService.GetTopPerformersAsync(from, to, limit);
                return Ok(topPerformers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetDailyGoalLeaderboard(
            [FromQuery] DateTime? date = null,
            [FromQuery] int limit = 10)
        {
            try
            {
                var targetDate = date ?? DateTime.Today;
                var leaderboard = await _taskService.GetDailyGoalLeaderboardAsync(targetDate, limit);
                return Ok(leaderboard);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion
    }
}

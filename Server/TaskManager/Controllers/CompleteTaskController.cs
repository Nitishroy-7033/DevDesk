using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Models;
using TaskManager.Services;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CompleteTaskController : ControllerBase
    {
        private readonly ITaskCompleteService _taskService;
        public CompleteTaskController(ITaskCompleteService taskService)
        {
            _taskService = taskService;
        }


        [HttpPost]
        public async Task<IActionResult> CompleteTask([FromBody] TaskCompletionRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.TaskId))
                {
                    return BadRequest("Task ID is required.");
                }

                await _taskService.AddCompletedTaskAsync(request);

                return Ok(new { message = "Task marked as completed successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to complete task", detail = ex.Message });
            }
        }
    }
}

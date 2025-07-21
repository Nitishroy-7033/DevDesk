using Microsoft.AspNetCore.Mvc;
using TaskManager.Models;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers
{
    [Route("Task")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskRequest item)
        {
            try
            {
                await _taskService.CreateNewTask(item);
                return Ok("Task Created");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTasks([FromQuery] TaskQueryRequest query)
        {
            try
            {
                var tasks = await _taskService.GetAllTask(query);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(string id)
        {
            try
            {
                await _taskService.DeleteTask(id);
                return Ok("Task Deleted");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("upcoming-task")]
        public async Task<IActionResult> GetUpcomingTask([FromQuery] DateTime date)
        {
            try
            {
                var response = await _taskService.GetUpcomingTasksAsync(date);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}

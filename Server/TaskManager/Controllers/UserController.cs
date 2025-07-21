using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Models;
using TaskManager.Models.Response;
using TaskManager.Services.Interfaces;

namespace TaskManager.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // --------- AUTH ---------

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRequest newUser)
        {
            try
            {
                var success = await _userService.RegisterAsync(newUser);
                return Ok(new { success, message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _userService.LoginAsync(request.Phone, request.Password);
                if (user == null)
                    return Unauthorized(new { message = "Invalid phone or password" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // --------- USER DATA ---------

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null) return NotFound(new { message = "User not found" });
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("phone/{phone}")]
        public async Task<IActionResult> GetByPhone(string phone)
        {
            try
            {
                var user = await _userService.GetUserByPhoneAsync(phone);
                if (user == null) return NotFound(new { message = "User not found" });
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // --------- PREFERENCES ---------

        [HttpPut("{id}/preferences")]
        public async Task<IActionResult> UpdatePreferences(string id, [FromBody] UserPreferences prefs)
        {
            try
            {
                await _userService.UpdatePreferencesAsync(id, prefs);
                return Ok(new { message = "Preferences updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // --------- TASK STATS ---------

        [HttpPost("{id}/tasks-created")]
        public async Task<IActionResult> IncrementTasksCreated(string id)
        {
            try
            {
                await _userService.IncrementTasksCreatedAsync(id);
                return Ok(new { message = "Task count updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/tasks-completed")]
        public async Task<IActionResult> IncrementTasksCompleted(string id)
        {
            try
            {
                await _userService.IncrementTasksCompletedAsync(id);
                return Ok(new { message = "Completed task count updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/log-hours")]
        public async Task<IActionResult> LogHours(string id, [FromQuery] double hours)
        {
            try
            {
                await _userService.AddLoggedHoursAsync(id, hours);
                return Ok(new { message = "Hours logged" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // --------- DELETE ---------

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "User deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

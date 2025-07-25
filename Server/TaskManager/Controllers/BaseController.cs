using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TaskManager.Controllers;

public class BaseController : ControllerBase
{
    protected string GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User not authenticated");

        return userIdClaim.Value;
    }

    protected string? GetCurrentUserRole()
    {
        return User.FindFirst("role")?.Value;
    }

    protected bool IsCurrentUserAdmin()
    {
        return GetCurrentUserRole()?.ToLower() == "admin";
    }
}

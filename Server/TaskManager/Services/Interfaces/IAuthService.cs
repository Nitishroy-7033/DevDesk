using System;
using TaskManager.Models.Response;

namespace TaskManager.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(string phone, string password);
}

using System;
using TaskManager.Models.Response;

namespace TaskManager.Repositories.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(string phone, string password);
}

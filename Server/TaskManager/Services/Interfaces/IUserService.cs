using System;
using TaskManager.Models;
using TaskManager.Models.Response;

namespace TaskManager.Services.Interfaces;

public interface IUserService
{
    // ----------- AUTH -----------

    Task<bool> RegisterAsync(UserRequest newUser);            // Handles password hashing
    Task<User?> LoginAsync(string username, string password); // Verifies password

    // ----------- USER DATA -----------

    Task<User?> GetUserByIdAsync(string userId);
    Task<User?> GetUserByPhoneAsync(string phone);
    Task<List<User>> GetAllUsersAsync();
    Task DeleteUserAsync(string userId);

    // ----------- PREFERENCES -----------

    Task UpdatePreferencesAsync(string userId, UserPreferences preferences);

    // ----------- TASK STATS -----------

    Task IncrementTasksCreatedAsync(string userId);
    Task IncrementTasksCompletedAsync(string userId);
    Task AddLoggedHoursAsync(string userId, double hours);
}

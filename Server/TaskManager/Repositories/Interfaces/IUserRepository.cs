using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManager.Models;

namespace TaskManager.Repositories.Interfaces;

public interface IUserRepository
{
    // ---------- AUTH ----------
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByPhoneAsync(string phone);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ValidateUserCredentialsAsync(string username, string passwordHash);
    Task CreateAsync(User user);

    // ---------- TASK STATS ----------
    Task IncrementTasksCreatedAsync(string userId);
    Task IncrementTasksCompletedAsync(string userId);
    Task AddLoggedHoursAsync(string userId, double hours);

    // ---------- PREFERENCES ----------
    Task UpdatePreferencesAsync(string userId, UserPreferences preferences);

    // ---------- USER MANAGEMENT ----------
    Task<List<User>> GetAllUsersAsync();
    Task DeleteUserAsync(string userId);
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManager.Models;
using TaskManager.Repositories.Interfaces;
using BCrypt.Net;
using TaskManager.Services.Interfaces;
using TaskManager.Models.Response;

namespace TaskManager.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // ---------------- AUTH ----------------

    public async Task<bool> RegisterAsync(UserRequest newUser)
    {
        var user = new User
        {
            Name = newUser.Name,
            Phone = newUser.Phone,
            PasswordHash = HashPassword(newUser.Password),
            CreatedAt = DateTime.Now,
        };

        var existingPhone = await _userRepository.GetByPhoneAsync(newUser.Phone);
        if (existingPhone != null)
            throw new Exception("Phone number already in use");
        await _userRepository.CreateAsync(user);
        return true;
    }

    public async Task<User?> LoginAsync(string username, string password)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        if (user == null || !VerifyPassword(password, user.PasswordHash))
        {
            return null;
        }
        return user;
    }

    // ---------------- PASSWORD ----------------

    private string HashPassword(string plainPassword)
    {
        return BCrypt.Net.BCrypt.HashPassword(plainPassword);
    }

    private bool VerifyPassword(string plainPassword, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword);
    }

    // ---------------- USER GET ----------------

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _userRepository.GetByIdAsync(userId);
    }

    public async Task<User?> GetUserByPhoneAsync(string phone)
    {
        return await _userRepository.GetByPhoneAsync(phone);
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllUsersAsync();
    }

    // ---------------- PREFERENCES ----------------

    public async Task UpdatePreferencesAsync(string userId, UserPreferences preferences)
    {
        await _userRepository.UpdatePreferencesAsync(userId, preferences);
    }

    // ---------------- TASK STATS ----------------

    public async Task IncrementTasksCreatedAsync(string userId)
    {
        await _userRepository.IncrementTasksCreatedAsync(userId);
    }

    public async Task IncrementTasksCompletedAsync(string userId)
    {
        await _userRepository.IncrementTasksCompletedAsync(userId);
    }

    public async Task AddLoggedHoursAsync(string userId, double hours)
    {
        await _userRepository.AddLoggedHoursAsync(userId, hours);
    }

    // ---------------- DELETE ----------------

    public async Task DeleteUserAsync(string userId)
    {
        await _userRepository.DeleteUserAsync(userId);
    }
}

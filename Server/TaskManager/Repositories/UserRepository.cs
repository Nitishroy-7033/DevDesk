using System;
using System.Threading.Tasks;
using MongoDB.Driver;
using TaskManager.Models;
using System.Collections.Generic;
using TaskManager.DbContext;
using TaskManager.Repositories.Interfaces;

namespace TaskManager.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext<User> dbContext)
    {
        _users = dbContext.GetCollection();
    }

    // ------------------ AUTH -------------------

    public async Task<User?> GetByIdAsync(string id) =>
        await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task<User?> GetByUsernameAsync(string username) =>
        await _users.Find(u => u.UserName.ToLower() == username.ToLower()).FirstOrDefaultAsync();

    public async Task<User?> GetByPhoneAsync(string phone) =>
        await _users.Find(u => u.Phone == phone).FirstOrDefaultAsync();

    public async Task<User?> GetByEmailAsync(string email) =>
        await _users.Find(u => u.Email != null && u.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();

    public async Task CreateAsync(User user) =>
        await _users.InsertOneAsync(user);

    public async Task<bool> ValidateUserCredentialsAsync(string username, string passwordHash)
    {
        var user = await GetByUsernameAsync(username);
        if (user == null) return false;
        return user.PasswordHash == passwordHash;
    }

    // ------------------ TASK STATS -------------------

    public async Task IncrementTasksCreatedAsync(string userId)
    {
        var update = Builders<User>.Update.Inc(u => u.TotalTasksCreated, 1);
        await _users.UpdateOneAsync(u => u.Id == userId, update);
    }

    public async Task IncrementTasksCompletedAsync(string userId)
    {
        var update = Builders<User>.Update.Inc(u => u.TotalTasksCompleted, 1);
        await _users.UpdateOneAsync(u => u.Id == userId, update);
    }

    public async Task AddLoggedHoursAsync(string userId, double hours)
    {
        var update = Builders<User>.Update.Inc(u => u.TotalHoursLogged, hours);
        await _users.UpdateOneAsync(u => u.Id == userId, update);
    }

    // ------------------ PREFERENCES -------------------

    public async Task UpdatePreferencesAsync(string userId, UserPreferences preferences)
    {
        var update = Builders<User>.Update.Set(u => u.Preferences, preferences);
        await _users.UpdateOneAsync(u => u.Id == userId, update);
    }

    // ------------------ ADMIN / LIST -------------------

    public async Task<List<User>> GetAllUsersAsync() =>
        await _users.Find(_ => true).ToListAsync();

    public async Task DeleteUserAsync(string userId) =>
        await _users.DeleteOneAsync(u => u.Id == userId);
}

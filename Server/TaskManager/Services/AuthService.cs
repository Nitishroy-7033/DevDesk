using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskManager.Models;
using TaskManager.Models.Response;
using TaskManager.Repositories.Interfaces;

namespace TaskManager.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponse> LoginAsync(string phone, string password)
    {
        if (string.IsNullOrWhiteSpace(phone) || string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Phone number and password must be provided.");

        // Find user
        var user = await _userRepository.GetByPhoneAsync(phone);

        if (user == null)
            throw new UnauthorizedAccessException("Phone number not registered.");

        // Verify password
        if (!VerifyPassword(password, user.PasswordHash))
            throw new UnauthorizedAccessException("Incorrect password.");

        // Generate JWT Token
        var jwtToken = GenerateJwtToken(user);

        // Prepare response
        var authResponse = new AuthResponse
        {
            Token = jwtToken,
            UserId = user.Id,
            UserName = user.Name,
            UserPhone = user.Phone,
            UserRole = user.Role,
            ExpireAt = DateTime.UtcNow.AddDays(7),
            TokenType = "Bearer",
        };

        return authResponse;
    }

    private bool VerifyPassword(string inputPassword, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim("role", user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManager.Models.Response;

public class AuthResponse
{
    public string Token { get; set; }
    public string UserName { get; set; }
    public string UserId { get; set; }
    public string UserPhone { get; set; }
    public DateTime ExpireAt { get; set; } = DateTime.Now.AddDays(1);
    public string TokenType { get; set; } = "Bearer";
    [BsonRepresentation(BsonType.String)]
    public string UserRole { get; set; }
    public bool IsVerified { get; set; }
}

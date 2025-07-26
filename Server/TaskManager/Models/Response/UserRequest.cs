using System;

namespace TaskManager.Models.Response;

public class UserRequest
{
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Password { get; set; }
}

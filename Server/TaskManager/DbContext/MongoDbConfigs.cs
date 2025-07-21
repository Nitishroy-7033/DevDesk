using System;

namespace TaskManager.DbContext;

public class MongoDbConfigs
{
    public const string Option = "MongoDbConfigs";
    public required string ConnectionString { get; set; }
    public required string DatabaseName { get; set; }
    public bool EnableCommandTracing { get; set; }
}

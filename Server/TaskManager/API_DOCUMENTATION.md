# Advanced Task Management System API Documentation

## Overview

This enhanced task management system provides comprehensive features for creating, tracking, and analyzing user tasks with advanced scheduling, execution monitoring, and analytics capabilities.

## Key Features Implemented

### 1. Enhanced Task Model

- **Time-based scheduling**: Tasks with start/end times in HH:mm format
- **Advanced repeat patterns**: Daily, weekly, custom days, or one-time tasks
- **Priority levels**: Low, Medium, High, Critical
- **Categorization**: Tags and categories for organization
- **Reminders**: Configurable reminder notifications
- **Analytics tracking**: Completion rates, statistics, and performance metrics

### 2. Task Execution Tracking

- **Real-time execution monitoring**: Start, pause, resume, complete, skip actions
- **Actual vs Expected duration tracking**: Performance analysis
- **Completion percentage**: Track partial task completion
- **Notes and context**: Add notes during task execution
- **Interruption tracking**: Monitor task interruptions and efficiency

### 3. Comprehensive Query System

- **Advanced filtering**: By date, priority, category, tags, status
- **Flexible date ranges**: Single day, custom ranges, recurring patterns
- **Sorting options**: By time, priority, creation date, title
- **Pagination support**: Efficient handling of large datasets

## API Endpoints

### Basic Task Management

#### Create Task

```
POST /api/task
```

**Payload:**

```json
{
  "userId": "string",
  "title": "string",
  "description": "string (optional)",
  "startTime": "HH:mm",
  "endTime": "HH:mm",
  "repeatCycleType": "daily|weekly|custom|none",
  "customRepeatDays": [0, 1, 2, 3, 4, 5, 6],
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T00:00:00Z",
  "priority": "Low|Medium|High|Critical",
  "category": "string (optional)",
  "tags": ["string"],
  "colorHex": "#4CAF50",
  "iconName": "task",
  "enableReminders": true,
  "reminderMinutesBefore": 15,
  "isTemplate": false
}
```

#### Get Task

```
GET /api/task/{id}
```

#### Update Task

```
PUT /api/task/{id}
```

#### Delete Task

```
DELETE /api/task/{id}
```

### Query Operations

#### Advanced Task Search

```
POST /api/task/search
```

**Payload:**

```json
{
  "userId": "string (optional)",
  "status": "All|Pending|Completed|InProgress|Skipped",
  "date": "2024-01-01T00:00:00Z (optional)",
  "fromDate": "2024-01-01T00:00:00Z (optional)",
  "toDate": "2024-12-31T00:00:00Z (optional)",
  "priority": "Low|Medium|High|Critical (optional)",
  "category": "string (optional)",
  "tags": ["string (optional)"],
  "repeatCycleType": "daily|weekly|custom|none (optional)",
  "includeCompleted": true,
  "includeUpcoming": true,
  "onlyActiveTasks": true,
  "sortBy": "StartTime|Priority|CreatedAt|Title",
  "sortOrder": "ASC|DESC",
  "pageSize": 20,
  "page": 1
}
```

#### Get Tasks for Specific Day

```
GET /api/task/day/{userId}?date=2024-01-01
```

**Response:**

```json
{
  "date": "2024-01-01T00:00:00Z",
  "upcomingTasks": [...],
  "completedTasks": [...],
  "inProgressTasks": [...],
  "skippedTasks": [...],
  "statistics": {
    "totalTasks": 10,
    "completedTasks": 7,
    "pendingTasks": 2,
    "skippedTasks": 1,
    "overdueTasks": 0,
    "completionRate": 70.0,
    "totalPlannedMinutes": 480,
    "totalActualMinutes": 420,
    "productivityScore": 87.5
  }
}
```

#### Get Upcoming Tasks

```
GET /api/task/upcoming?date=2024-01-01
```

#### Get Tasks in Date Range

```
GET /api/task/range/{userId}?fromDate=2024-01-01&toDate=2024-01-31
```

### Task Execution Management

#### Start Task

```
POST /api/task/start
```

**Payload:**

```json
{
  "taskId": "string",
  "userId": "string",
  "executionDate": "2024-01-01T00:00:00Z"
}
```

#### Complete Task

```
POST /api/task/complete
```

**Payload:**

```json
{
  "taskId": "string",
  "userId": "string",
  "executionDate": "2024-01-01T00:00:00Z",
  "actualDurationMinutes": 60,
  "completionPercentage": 100,
  "notes": "Task completed successfully",
  "isManuallyMarked": false
}
```

#### Update Task Execution

```
POST /api/task/update-execution
```

**Payload:**

```json
{
  "taskId": "string",
  "userId": "string",
  "executionDate": "2024-01-01T00:00:00Z",
  "action": "start|pause|resume|complete|skip",
  "completionPercentage": 50,
  "notes": "string (optional)",
  "actualDurationMinutes": 30
}
```

#### Get Execution History

```
GET /api/task/execution-history/{userId}?fromDate=2024-01-01&toDate=2024-01-31
```

### Analytics and Reporting

#### Get Task Analytics

```
GET /api/task/analytics/{userId}?fromDate=2024-01-01&toDate=2024-01-31
```

**Response:**

```json
{
  "userId": "string",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-01-31T00:00:00Z",
  "totalTasksCreated": 50,
  "totalTasksCompleted": 40,
  "totalTasksSkipped": 5,
  "overallCompletionRate": 80.0,
  "averageTaskDuration": 45.5,
  "categoryStats": [
    {
      "category": "Work",
      "taskCount": 20,
      "completedCount": 18,
      "completionRate": 90.0,
      "averageDuration": 60.0
    }
  ],
  "dailyStats": [...],
  "mostProductiveDays": ["Monday", "Tuesday"],
  "mostProductiveTimeSlots": ["09:00-11:00", "14:00-16:00"]
}
```

## Advanced Features

### 1. Smart Scheduling

- **Repeat Patterns**: Support for daily, weekly, and custom day patterns
- **Date Range Validation**: Automatic validation of task scheduling within date ranges
- **Overnight Tasks**: Proper handling of tasks that span midnight

### 2. Execution Monitoring

- **Real-time Tracking**: Monitor task start, pause, resume, and completion
- **Efficiency Metrics**: Calculate efficiency scores based on planned vs actual time
- **Interruption Tracking**: Count and analyze task interruptions

### 3. Analytics Dashboard

- **Completion Rates**: Track overall and category-specific completion rates
- **Productivity Scores**: Calculate productivity based on time efficiency
- **Trend Analysis**: Daily, weekly, and monthly productivity trends
- **Category Performance**: Analyze performance across different task categories

### 4. Enhanced Payload Support

- **Flexible Queries**: Support for complex filtering and sorting
- **Pagination**: Efficient handling of large datasets
- **Validation**: Comprehensive input validation and error handling
- **Extensibility**: Easy to extend with additional fields and features

## Database Models

### TaskItem

- Enhanced with priority, category, analytics fields
- Support for reminders and notifications
- Template functionality for recurring task patterns

### TaskExecutionRecord

- Complete execution tracking with timestamps
- Performance metrics and efficiency calculations
- Notes and context for each execution

### User Statistics Integration

- Automatic updating of user completion stats
- Time logging and productivity tracking
- Integration with task completion events

## Usage Examples

### Creating a Daily Exercise Task

```json
{
  "userId": "user123",
  "title": "Morning Exercise",
  "description": "30 minutes cardio workout",
  "startTime": "07:00",
  "endTime": "07:30",
  "repeatCycleType": "daily",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T00:00:00Z",
  "priority": "High",
  "category": "Health",
  "tags": ["exercise", "morning", "cardio"],
  "colorHex": "#FF5722",
  "iconName": "fitness",
  "enableReminders": true,
  "reminderMinutesBefore": 10
}
```

### Creating a Custom Schedule Task

```json
{
  "userId": "user123",
  "title": "Team Meeting",
  "description": "Weekly team sync meeting",
  "startTime": "10:00",
  "endTime": "11:00",
  "repeatCycleType": "custom",
  "customRepeatDays": [1, 3, 5], // Monday, Wednesday, Friday
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-06-30T00:00:00Z",
  "priority": "Medium",
  "category": "Work",
  "tags": ["meeting", "team"],
  "enableReminders": true,
  "reminderMinutesBefore": 15
}
```

This enhanced system provides a comprehensive solution for task management with advanced scheduling, tracking, and analytics capabilities that can support complex productivity workflows and detailed performance analysis.

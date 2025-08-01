import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Row, Col, Progress } from "antd";
import { Clock, AlertTriangle, CheckCircle, Play, Pause } from "lucide-react";

const TasksCalendarView = ({
  selectedDate,
  onDateSelect,
  calendarTasks,
  formatTime,
}) => {
  const stats = calendarTasks.statistics || {};

  return (
    <div className="calendar-view">
      <Card className="calendar-card">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => {
              if (value) {
                const year = value.getFullYear();
                const month = String(value.getMonth() + 1).padStart(2, "0");
                const day = String(value.getDate()).padStart(2, "0");
                const formattedDate = `${year}-${month}-${day}`;
                onDateSelect(value, formattedDate);
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="tasks-calendar-card">
        <CardHeader>
          <CardTitle>Tasks for {selectedDate?.toLocaleDateString()}</CardTitle>
          {/* Daily Statistics */}
          
            {stats.totalTasks > 0 && (
            <div className="flex justify-between  md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedTasks}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingTasks}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {stats.overdueTasks}
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>
          )}
         

          {/* Completion Rate Progress */}
          {stats.totalTasks > 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Daily Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round(stats.completionRate)}%
                </span>
              </div>
              <Progress
                percent={Math.round(stats.completionRate)}
                strokeColor="#10b981"
                trailColor="#e5e7eb"
                size="small"
              />
            </div>
          )}
        </CardHeader>

        <div style={{
        
        }}>
          <CardContent className="grid gap-5">
          {/* Render different task sections */}
          {renderTaskSection(
            "Upcoming Tasks",
            calendarTasks.upcomingTasks,
            "upcoming",
            formatTime
          )}
          {renderTaskSection(
            "In Progress",
            calendarTasks.inProgressTasks,
            "inprogress",
            formatTime
          )}
          {renderTaskSection(
            "Completed Tasks",
            calendarTasks.completedTasks,
            "completed",
            formatTime
          )}
          {renderTaskSection(
            "Skipped Tasks",
            calendarTasks.skippedTasks,
            "skipped",
            formatTime
          )}
        </CardContent>
        </div>
      </Card>
    </div>
  );
};

const renderTaskSection = (title, tasks, type, formatTime) => {
  if (!tasks || tasks.length === 0) return null;

  const getSectionColor = (type) => {
    switch (type) {
      case "upcoming":
        return "text-blue-600";
      case "inprogress":
        return "text-yellow-600";
      case "completed":
        return "text-green-600";
      case "skipped":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-3 ${getSectionColor(type)}`}>
        {title} ({tasks.length})
      </h3>
      <div className="space-y-3">
        {tasks.map((taskItem, index) => (
          <TaskCalendarItem
            key={index}
            taskItem={taskItem}
            formatTime={formatTime}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

const TaskCalendarItem = ({ taskItem, formatTime, type }) => {
  const task = taskItem.task || taskItem;
  const isOverdue = taskItem.isOverdue;
  const currentStatus = taskItem.currentStatus || "NotStarted";

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "InProgress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Play className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Skipped":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <Pause className="w-3 h-3 mr-1" />
            Skipped
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Not Started
          </Badge>
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md rounded-xl  p-4 border ${
        isOverdue
          ? "border-red-300 bg-red-50 dark:bg-red-900/10"
          : "border-gray-200 dark:border-gray-700"
      } hover:shadow-lg transition-shadow`} 
    >
      {/* Header with icon, title, and status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{task.iconName}</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task.title}
          </h3>
          {isOverdue && (
            <Badge className="bg-red-100 text-red-800 border-red-300">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Time Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">
            <strong>Time:</strong> {task.startTime} - {task.endTime}
          </span>
        </div>

        {task.expectedDurationMinutes > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Duration:</strong>{" "}
              {Math.floor(task.expectedDurationMinutes / 60)}h{" "}
              {task.expectedDurationMinutes % 60}m
            </span>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Priority Badge */}
        {task.priority && (
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority} Priority
          </Badge>
        )}

        {/* Repeat Information */}
        {task.repeatCycleType && task.repeatCycleType !== "none" && (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            {task.customRepeatDays?.length > 0
              ? `Custom (${task.customRepeatDays.length} days)`
              : task.repeatCycleType}
          </Badge>
        )}

        {/* Category */}
        {task.category && (
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">
            {task.category}
          </Badge>
        )}

        {/* Reminders */}
        {task.enableReminders && (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            Reminder: {task.reminderMinutesBefore}m before
          </Badge>
        )}
      </div>

      {/* Performance Stats (if available) */}
      {(task.totalCompletions > 0 || task.completionRate > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div>
              Completions:{" "}
              <span className="font-semibold">{task.totalCompletions}</span>
            </div>
            <div>
              Skips: <span className="font-semibold">{task.totalSkips}</span>
            </div>
            <div>
              Rate:{" "}
              <span className="font-semibold">
                {Math.round(task.completionRate)}%
              </span>
            </div>
            {task.averageCompletionTime > 0 && (
              <div>
                Avg Time:{" "}
                <span className="font-semibold">
                  {Math.round(task.averageCompletionTime)}m
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksCalendarView;

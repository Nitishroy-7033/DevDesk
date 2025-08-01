import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TaskCard = ({ task, onTaskClick }) => {
  const formatTime = (timeStr) => {
    // Remove the :00 seconds using regex
    return timeStr.replace(/:00\s/, " ");
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onTaskClick && onTaskClick(task)}
    >
      <CardContent>
        <div className="task-header">
          <div
            className="task-icon-container"
            style={{ backgroundColor: task.color }}
          >
            {task.icon}
          </div>
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.description}</p>
          </div>
          <Badge className={`task-badge ${task.status}`}>{task.status}</Badge>
        </div>
        <div className="task-time-progress">
          <span>
            {formatTime(task.startTime)} - {formatTime(task.endTime)}
          </span>
          <span>{task.progress}%</span>
        </div>
        <div className="task-progress-bar">
          <div
            className="task-progress-fill"
            style={{ width: `${task.progress}%`, backgroundColor: task.color }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

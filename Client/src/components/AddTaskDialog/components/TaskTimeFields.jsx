import { Label } from "@/components/ui/label";

const TaskTimeFields = ({
  startTime,
  endTime,
  duration,
  onStartTimeChange,
  onEndTimeChange,
  validationErrors,
}) => {
  return (
    <div className="form-section">
      <div className="time-fields">
        <div className="form-group">
          <Label htmlFor="startTime">Start Time</Label>
          <input
            type="time"
            id="startTime"
            value={
              startTime ? new Date(startTime).toTimeString().slice(0, 5) : ""
            }
            onChange={(e) => {
              const timeValue = e.target.value;
              if (timeValue) {
                const [hours, minutes] = timeValue.split(":");
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                onStartTimeChange(date);
              } else {
                onStartTimeChange(null);
              }
            }}
            className={`time-picker ${
              validationErrors.timeRange ? "error" : ""
            }`}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="endTime">End Time</Label>
          <input
            type="time"
            id="endTime"
            value={endTime ? new Date(endTime).toTimeString().slice(0, 5) : ""}
            onChange={(e) => {
              const timeValue = e.target.value;
              if (timeValue) {
                const [hours, minutes] = timeValue.split(":");
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                onEndTimeChange(date);
              } else {
                onEndTimeChange(null);
              }
            }}
            className={`time-picker ${
              validationErrors.timeRange ? "error" : ""
            }`}
          />
        </div>
      </div>

      {duration && (
        <div className="duration-display">
          <span className="duration-label">Duration: </span>
          <span className="duration-value">{duration}</span>
        </div>
      )}

      {validationErrors.timeRange && (
        <div className="error-message">{validationErrors.timeRange}</div>
      )}
    </div>
  );
};

export default TaskTimeFields;

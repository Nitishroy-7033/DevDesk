import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskDateFields = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  validationErrors,
}) => {
  // Calculate the number of days between start and end date
  const calculateDaysDifference = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Reset time to avoid timezone issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffInMs = end - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays + 1; // +1 to include both start and end date
  };

  const daysDifference = calculateDaysDifference();
  return (
    <div className="form-section">
      <div className="date-fields">
        <div className="form-group">
          <Label htmlFor="startDate">Start Date</Label>
          <DatePicker
            selected={startDate}
            onChange={onStartDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select start date"
            className="date-picker"
            minDate={new Date()}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="endDate">End Date</Label>
          <DatePicker
            selected={endDate}
            onChange={onEndDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select end date"
            className="date-picker"
            minDate={startDate || new Date()}
          />
        </div>
      </div>

      {daysDifference !== null && daysDifference >= 1 && (
        <div className="duration-display">
          <span className="duration-label">Duration: </span>
          <span className="duration-value">
            {daysDifference === 1 ? "1 day" : `${daysDifference} days`}
          </span>
        </div>
      )}

      {validationErrors.dateRange && (
        <div className="error-message">{validationErrors.dateRange}</div>
      )}
    </div>
  );
};

export default TaskDateFields;

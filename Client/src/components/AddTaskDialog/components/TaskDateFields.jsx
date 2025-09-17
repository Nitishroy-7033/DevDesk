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

      {validationErrors.dateRange && (
        <div className="error-message">{validationErrors.dateRange}</div>
      )}
    </div>
  );
};

export default TaskDateFields;

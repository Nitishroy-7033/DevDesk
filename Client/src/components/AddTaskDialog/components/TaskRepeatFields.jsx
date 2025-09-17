import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const daysOfWeek = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

const TaskRepeatFields = ({
  repeatType,
  repeatDays,
  onRepeatTypeChange,
  onRepeatDaysChange,
  validationErrors,
}) => {
  const handleDayToggle = (day) => {
    const updatedDays = repeatDays.includes(day)
      ? repeatDays.filter((d) => d !== day)
      : [...repeatDays, day];
    onRepeatDaysChange(updatedDays);
  };

  return (
    <div className="form-section">
      <div className="form-group">
        <Label>Repeat</Label>
        <Select value={repeatType} onValueChange={onRepeatTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select repeat option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Repeat</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="custom">Custom Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {repeatType === "custom" && (
        <div className="form-group">
          <Label>Select Days</Label>
          <div className="days-grid">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                type="button"
                className={`day-option ${
                  repeatDays.includes(day.value) ? "selected" : ""
                }`}
                onClick={() => handleDayToggle(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskRepeatFields;

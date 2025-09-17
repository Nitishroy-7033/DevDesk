import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TaskBasicFields = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  validationErrors,
}) => {
  return (
    <div className="form-section">
      <div className="form-group">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter task title"
          className={validationErrors.title ? "error" : ""}
        />
        {validationErrors.title && (
          <div className="error-message">{validationErrors.title}</div>
        )}
      </div>

      <div className="form-group">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>
    </div>
  );
};

export default TaskBasicFields;

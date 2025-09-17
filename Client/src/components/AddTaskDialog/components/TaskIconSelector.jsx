import { Label } from "@/components/ui/label";

const icons = ["📚", "⚛️", "✍️", "🧮", "🔬", "🎨", "💻", "🎵", "🏃‍♂️", "🧘‍♀️"];

const TaskIconSelector = ({ selectedIcon, onIconSelect, validationErrors }) => {
  return (
    <div className="form-section">
      <div className="form-group">
        <Label>Task Icon</Label>
        <div className="icon-grid">
          {icons.map((icon, index) => (
            <button
              key={index}
              type="button"
              className={`icon-option ${
                selectedIcon === icon ? "selected" : ""
              }`}
              onClick={() => onIconSelect(icon)}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskIconSelector;

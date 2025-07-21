// TaskControls.jsx
import { Play, Pause, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TaskControls = ({
  isRunning,
  isFullscreen,
  onStart,
  onPause,
  onComplete,
}) => (
  <div className="controls">
    {!isRunning ? (
      <Button
        onClick={onStart}
        size={isFullscreen ? "lg" : "default"}
        style={{ backgroundColor: "#007bff", color: "#fff" }}
      >
        <Play /> Start
      </Button>
    ) : (
      <Button
        onClick={onPause}
        size={isFullscreen ? "lg" : "default"}
        style={{ backgroundColor: "#28a745", color: "#fff" }}
      >
        <Pause /> Pause
      </Button>
    )}
    <Button
      onClick={onComplete}
      size={isFullscreen ? "lg" : "default"}
      style={{ backgroundColor: "tomato", color: "#fff" }}
    >
      <CheckCircle2 /> Complete
    </Button>
  </div>
);

export default TaskControls;

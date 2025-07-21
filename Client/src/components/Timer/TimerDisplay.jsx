// TimerDisplay.jsx
import { Progress } from "@/components/ui/progress";
import CircularProgress from "./CircularProgress";

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const TimerDisplay = ({ countdownStyle, timeRemaining, totalTime, progress, isFullscreen }) => {
  switch (countdownStyle) {
    case "circle":
      return (
        <div className="circle-style">
          <CircularProgress value={progress} size={isFullscreen ? 300 : 200} />
          <p className="circle-total">Total: {formatTime(totalTime)}</p>
        </div>
      );

    case "minimal":
      return (
        <div className="minimal-style">
          <div className="minimal-time">{formatTime(timeRemaining)}</div>
          <Progress value={progress} />
          <p className="minimal-text">{Math.round(progress)}% of {formatTime(totalTime)}</p>
        </div>
      );

    case "neon":
      return (
        <div className="neon-style">
          <div className="neon-wrapper">
            <div className="neon-time">{formatTime(timeRemaining)}</div>
            <div className="neon-glow">{formatTime(timeRemaining)}</div>
          </div>
          <div className="neon-bar">
            <div className="neon-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="neon-text">{formatTime(totalTime)} session</p>
        </div>
      );

    default:
      return (
        <div className="digital-style">
          <div className="digital-time">{formatTime(timeRemaining)}</div>
          <p className="digital-total">Total: {formatTime(totalTime)}</p>
        </div>
      );
  }
};

export default TimerDisplay;

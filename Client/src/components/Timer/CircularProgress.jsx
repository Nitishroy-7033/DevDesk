// components/Timer/CircularProgress.jsx
import React from "react";

const CircularProgress = ({
  value,
  size = 200,
  timeRemaining,
  totalTime,
  formatTime,
}) => {
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="circular-wrapper" style={{ width: size, height: size }}>
      <svg className="circular-svg" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="circular-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="circular-progress"
          strokeLinecap="round"
        />
      </svg>
      <div className="circular-center">
        <div className="circular-time">{formatTime(timeRemaining)}</div>
        <div className="circular-text">{Math.round(value)}% Complete</div>
      </div>
    </div>
  );
};
export default CircularProgress;

// ActiveTaskPanel.jsx
import { useState, useEffect } from "react";
import "./AddTaskDialog.css";
import {
  Maximize,
  Play,
  Pause,
  RefreshCcw,
  Settings,
  SkipForwardIcon,
  CheckCircle,
  Save,
  SaveOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TimerDisplay, { formatTime } from "./Timer/TimerDisplay";
import TaskControls from "./Timer/TaskControls";
import CompletedCard from "./Timer/CompletedCard";
import { Col, Progress, Row } from "antd";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { useActiveTask } from "@/contexts/ActiveTaskContext";
import { formatTime as formatTimeUtil } from "@/utils/timeUtils";
import EnhancedCompleteTaskDialog from "./EnhancedCompleteTaskDialog";

export const ActiveTaskPanel = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const {
    activeTask,
    isRunning,
    timeRemaining,
    totalTime,
    isCompleted,
    autoSaveEnabled,
    taskStartTime,
    taskEndTime,
    startTimer,
    pauseTimer,
    completeTask,
    resetTaskWithConfirmation,
    moveToNextTask,
    hasNextTask,
    toggleAutoSave,
    progress,
  } = useActiveTask();

  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStart = () => startTimer();
  const handlePause = () => pauseTimer();
  const handleComplete = () => {
    setIsCompleteDialogOpen(true);
  };
  const handleReset = () => resetTaskWithConfirmation();
  const handleNextTask = () => moveToNextTask();

  const handleTaskCompleted = () => {
    setIsCompleteDialogOpen(false);
    setShowConfetti(true);
    // The completion will be handled by the dialog
  };

  const formatTime = (timeStr) => {
    // Remove the :00 seconds using regex
    return timeStr.replace(/:00\s/, " ");
  };

  // If task is completed, show completed card
  if (isCompleted) {
    return (
      <CompletedCard
        onReset={handleReset}
        onNextTask={handleNextTask}
        taskTitle={activeTask?.title}
        hasNextTask={hasNextTask}
      />
    );
  }

  // If no active task, show placeholder
  if (!activeTask) {
    return (
      <Card
        className={isFullscreen ? "fullscreen-card" : "normal-card"}
        style={{
          padding: "20px",
          height: isFullscreen ? "100vh" : "none",
        }}
      >
        <Row justify={"space-between"} align={"middle"}>
          <CardTitle className={`header-title ${isFullscreen ? "large" : ""}`}>
            Active Task
          </CardTitle>
          <div
            className="header-actions"
            style={{
              display: "flex",
              alignItems: "center",

              gap: "10px",
            }}
          >
            <div
              onClick={toggleAutoSave}
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor: autoSaveEnabled ? "#065f46" : "#7f1d1d",
                border: `1px solid ${autoSaveEnabled ? "#10b981" : "#ef4444"}`,
                borderRadius: "10px",
                marginRight: "10px",
              }}
              title={
                autoSaveEnabled
                  ? "Auto-save is ON - Click to disable"
                  : "Auto-save is OFF - Click to enable"
              }
            >
              {autoSaveEnabled ? (
                <Save size={20} color="#10b981" />
              ) : (
                <SaveOff size={20} color="#ef4444" />
              )}
            </div>
          </div>
        </Row>
        <br />
        <Col
          style={{
            height: "90%",
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", color: "#666" }}>
            No active task selected
          </div>
          <div style={{ fontSize: "14px", color: "#999", marginTop: "10px" }}>
            Select a task from the upcoming tasks to get started
          </div>
        </Col>
      </Card>
    );
  }

  return (
    <Card
      className={isFullscreen ? "fullscreen-card" : "normal-card"}
      style={{
        padding: "20px",
        height: isFullscreen ? "100vh" : "auto",

        // overflowy:"hidden"
      }}
    >
      <Row justify={"space-between"} align={"middle"}>
        <CardTitle className={`header-title ${isFullscreen ? "large" : ""}`}>
          Active Task
        </CardTitle>
        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            onClick={toggleAutoSave}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: autoSaveEnabled ? "#065f46" : "#7f1d1d",
              border: `1px solid ${autoSaveEnabled ? "#10b981" : "#ef4444"}`,
              borderRadius: "10px",
              marginRight: "10px",
            }}
            title={
              autoSaveEnabled
                ? "Auto-save is ON - Click to disable"
                : "Auto-save is OFF - Click to enable"
            }
          >
            {autoSaveEnabled ? (
              <Save size={20} color="#10b981" />
            ) : (
              <SaveOff size={20} color="#ef4444" />
            )}
          </div>
          {onToggleFullscreen && (
            <div
              onClick={onToggleFullscreen}
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor: "#323639",
                border: "1px solid #444444",
                borderRadius: "10px",
              }}
            >
              <Maximize size={20} />
            </div>
          )}
        </div>
      </Row>
      <br />
      <Col
        style={{
          alignContent: "center",
        }}
      >
        <Row
          justify={"center"}
          style={{
            fontSize: isFullscreen ? "15rem" : "8rem",
            fontWeight: "bolder",
          }}
        >
          {formatTimeUtil(timeRemaining)}
        </Row>
        {/* <FlipClockCountdown
          to={new Date().getTime() + 24 * 3600 * 1000 + 5000}
        /> */}
        <Row justify={"center"}>
          <Row
            style={{
              width: isFullscreen ? "40%" : "70%",
            }}
          >
            <Progress
              strokeLinecap="round"
              size={"default"}
              strokeWidth={"13px"}
              strokeColor={"green"}
              trailColor="#1e1e1e"
              type="line"
              showInfo={false}
              percent={Math.round(progress)}
            />
          </Row>
        </Row>
        <br />
        <Row justify={"center"}>
          <Row
            justify={"center"}
            style={{
              backgroundColor: "#323639",
              fontSize: "18px",
              padding: "10px 20px",
              border: "1px solid #444444",
              borderRadius: "15px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {activeTask.iconName} # {activeTask.title}
          </Row>
        </Row>
        {/* <br />
        <Row justify={"center"}>
          <div
            style={{
              fontSize: "14px",
              color: "#a0a0a0",
              textAlign: "center",
            }}
          >
            {activeTask.description}
          </div>
        </Row> */}
        <br />
        <Row justify={"center"} style={{ gap: "15px" }}>
          <div
            style={{
              backgroundColor: "#2d3748",
              padding: "8px 15px",
              borderRadius: "10px",
              fontSize: "14px",
              color: "#cbd5e0",
            }}
          >
            📅 {formatTime(activeTask.startTime)} -{" "}
            {formatTime(activeTask.endTime)}
          </div>
          <div
            style={{
              backgroundColor: "#4a5568",
              padding: "8px 15px",
              borderRadius: "10px",
              fontSize: "14px",
              color: "#cbd5e0",
            }}
          >
            ⏱️ {formatTimeUtil(totalTime)} total
          </div>
          {autoSaveEnabled && (
            <div
              style={{
                backgroundColor: "#065f46",
                padding: "8px 15px",
                borderRadius: "10px",
                fontSize: "12px",
                color: "#10b981",
                border: "1px solid #10b981",
              }}
            >
              💾 Auto-saved
            </div>
          )}
        </Row>
        <br />
        <br />

        <Row
          justify={"center"}
          style={{
            gap: "20px",
          }}
        >
          <div
            onClick={handleReset}
            style={{
              padding: "15px",
              backgroundColor: "#323639",
              border: "1px solid #444444",
              borderRadius: "15px",
              cursor: "pointer",
            }}
          >
            <RefreshCcw />
          </div>
          <div
            onClick={isRunning ? handlePause : handleStart}
            style={{
              padding: "15px",
              backgroundColor: isRunning ? "#ff6b6b" : "#51cf66",
              border: "1px solid #444444",
              borderRadius: "15px",
              display: "flex",
              gap: "10px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {isRunning ? <Pause /> : <Play />}
            {isRunning ? "PAUSE" : "START"}
          </div>
          <div
            onClick={handleComplete}
            style={{
              padding: "15px",
              backgroundColor: "#4dabf7",
              border: "1px solid #444444",
              borderRadius: "15px",
              cursor: "pointer",
            }}
          >
            <CheckCircle />
          </div>
        </Row>
      </Col>

      {/* Enhanced Complete Task Dialog */}
      {activeTask && (
        <EnhancedCompleteTaskDialog
          isOpen={isCompleteDialogOpen}
          onClose={() => setIsCompleteDialogOpen(false)}
          task={activeTask}
          executionDate={new Date().toISOString().split("T")[0]}
          onTaskCompleted={handleTaskCompleted}
          completionMethod="manual"
          timerData={{
            startTime: taskStartTime,
            endTime: new Date().toISOString(),
            duration: Math.round((totalTime - timeRemaining) / 60),
            wasUsingTimer: true,
          }}
        />
      )}
    </Card>
  );
};

export default ActiveTaskPanel;

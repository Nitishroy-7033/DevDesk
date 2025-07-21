// ActiveTaskPanel.jsx
import { useState, useEffect } from "react";
import {
  Maximize,
  Play,
  RefreshCcw,
  Settings,
  SkipForwardIcon,
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

export const ActiveTaskPanel = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdownStyle, setCountdownStyle] = useState("digital");

  const totalTime = 7200;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleComplete = () => {
    setIsRunning(false);
    setIsCompleted(true);
  };
  const handleReset = () => {
    setIsCompleted(false);
    setTimeRemaining(totalTime);
  };

  if (isCompleted) return <CompletedCard onReset={handleReset} />;

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
        <div className="header-actions">
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
          height: "90%",
          // backgroundColor: "red",
          alignContent: "center",
        }}
      >
        <Row
          justify={"center"}
          style={{
            fontSize: isFullscreen ? "20rem" : "8rem",
            fontWeight: "bolder",
          }}
        >
          12:30:23
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
              percent={75}
            />
          </Row>
        </Row>
        <br />
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
            }}
          >
            🥇 #3 - Learn how to implement open ai in flutter
          </Row>
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
            style={{
              padding: "15px",
              backgroundColor: "#323639",
              border: "1px solid #444444",
              borderRadius: "15px",
            }}
          >
            <RefreshCcw />
          </div>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#323639",
              border: "1px solid #444444",
              borderRadius: "15px",
              display: "flex",
              gap: "10px",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            <Play /> START
          </div>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#323639",
              border: "1px solid #444444",
              borderRadius: "15px",
            }}
          >
            <SkipForwardIcon />
          </div>
        </Row>
      </Col>
    </Card>
  );
};

export default ActiveTaskPanel;

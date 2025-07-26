// CompletedCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, SkipForward, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompletedCard = ({ onReset, onNextTask, taskTitle, hasNextTask }) => (
  <Card className="completed-card">
    <CardContent className="completed-content">
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <CheckCircle2
          style={{
            fontSize: "64px",
            color: "#4caf50",
            marginBottom: "20px",
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
          }}
        />
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#4caf50",
          }}
        >
          🎉 Task Completed!
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.5",
          }}
        >
          Excellent work! You've successfully completed{" "}
          {taskTitle ? `"${taskTitle}"` : "your task"}.
          {hasNextTask ? " Ready for the next challenge?" : " Great job today!"}
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {hasNextTask && (
            <Button
              onClick={onNextTask}
              style={{
                backgroundColor: "#4caf50",
                borderColor: "#4caf50",
                padding: "12px 24px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SkipForward size={18} />
              Next Task
            </Button>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={18} />
            New Session
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CompletedCard;

// CompletedCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompletedCard = ({ onReset }) => (
  <Card className="completed-card">
    <CardContent className="completed-content">
      <CheckCircle2 className="completed-icon" />
      <h2 className="completed-title">🎉 Task Completed!</h2>
      <p className="completed-text">
        Great job! You’ve successfully completed your study session.
      </p>
      <Button onClick={onReset} className="completed-button">
        Start New Task
      </Button>
    </CardContent>
  </Card>
);

export default CompletedCard;

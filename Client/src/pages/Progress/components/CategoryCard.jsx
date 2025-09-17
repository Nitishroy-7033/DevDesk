import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { formatTime } from "../context/Actions";

const CategoryCard = ({
  category,
  timeSpent,
  completedTasks,
  totalTasks,
  completionRate,
}) => (
  <Card className="progress-card">
    <CardContent>
      <div className="category-card">
        <div className="category-header">
          <h3>{category}</h3>
          <Badge>{formatTime(timeSpent)}</Badge>
        </div>
        <div className="progress-details">
          <div className="progress-row">
            <span>Progress</span>
            <span>
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <ProgressBar value={completionRate} className="progress-bar" />
          <div className="progress-row small">
            <span>Completion Rate</span>
            <span>{completionRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CategoryCard;

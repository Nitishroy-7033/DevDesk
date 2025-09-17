import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "../context/Actions";

const LeaderboardCard = ({
  user,
  rank,
  timeSpent,
  tasksCompleted,
  completionRate,
}) => (
  <Card className="progress-card">
    <CardContent>
      <div className="leaderboard-item">
        <div className="leaderboard-left">
          <div className="rank-circle">#{rank}</div>
          <Avatar className="avatar">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="leader-name">{user.name}</p>
            <p className="leader-email">{user.email}</p>
          </div>
        </div>
        <div className="leaderboard-right">
          <div className="badges">
            <Badge>{tasksCompleted} tasks</Badge>
            <Badge>{formatTime(timeSpent)}</Badge>
          </div>
          <p className="completion-rate">
            {completionRate.toFixed(1)}% completed
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default LeaderboardCard;

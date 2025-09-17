import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card className="progress-card">
    <CardContent>
      <div className="card-header">
        <div>
          <p className="card-subtitle">{title}</p>
          <p className="card-value">{value}</p>
          {description && <p className="card-desc">{description}</p>}
        </div>
        <Icon className="card-icon" />
      </div>
    </CardContent>
  </Card>
);

export default StatCard;

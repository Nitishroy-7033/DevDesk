import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Clock, Target, TrendingUp, Calendar, User, Award, CheckCircle2, BarChart3, Timer } from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import './Progress.css'

export const Progress = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);

        const stats = await apiClient.getUserStats(user?.id);
        setUserStats(stats);

        const weeklyData = await apiClient.getLeaderboard('weekly');
        const monthlyData = await apiClient.getLeaderboard('monthly');

        setWeeklyLeaderboard(weeklyData);
        setMonthlyLeaderboard(monthlyData);

        const categories = ['Math', 'Physics', 'History', 'Chemistry', 'Biology'];
        const categoryData = await Promise.all(
          categories.map(async (category) => {
            const timeSpent = await apiClient.getTimeSpentOnSimilarTasks(category);
            const tasks = await apiClient.getTasksByCategory(category);
            const completedTasks = tasks.filter(task => task.status === 'completed');
            return {
              category,
              timeSpent,
              totalTasks: tasks.length,
              completedTasks: completedTasks.length,
              completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
            };
          })
        );
        setCategoryStats(categoryData);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

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

  const LeaderboardCard = ({ user, rank, timeSpent, tasksCompleted, completionRate }) => (
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
            <p className="completion-rate">{completionRate.toFixed(1)}% completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CategoryCard = ({ category, timeSpent, completedTasks, totalTasks, completionRate }) => (
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
              <span>{completedTasks}/{totalTasks}</span>
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

  if (loading) {
    return (
      <div className="progress-wrapper">
        <Header />
        <main className="progress-main">
          <div className="loading-spinner"></div>
          <p>Loading progress data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="progress-wrapper">
      <Header />
      <main className="progress-main">
        <div className="section-header">
          <h1>Progress Dashboard</h1>
          <p>Track your productivity and see how you compare with others</p>
        </div>
        <Tabs defaultValue="overview" className="tabs">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal Stats</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="stats-grid">
              <StatCard title="Total Tasks" value={userStats?.totalTasks || 0} icon={Target} />
              <StatCard title="Completed" value={userStats?.completedTasks || 0} icon={CheckCircle2} />
              <StatCard title="Time Spent" value={formatTime(userStats?.totalTimeSpent || 0)} icon={Timer} />
              <StatCard title="Completion Rate" value={`${userStats?.completionRate?.toFixed(1) || 0}%`} icon={TrendingUp} />
            </div>
            <div className="grid-two">
              <Card className="progress-card">
                <CardHeader>
                  <CardTitle><Calendar /> Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="progress-detail">
                    <span>Tasks Completed</span>
                    <strong>{userStats?.weeklyStats?.tasksCompleted || 0}</strong>
                  </div>
                  <div className="progress-detail">
                    <span>Time Spent</span>
                    <strong>{formatTime(userStats?.weeklyStats?.timeSpent || 0)}</strong>
                  </div>
                </CardContent>
              </Card>
              <Card className="progress-card">
                <CardHeader>
                  <CardTitle><BarChart3 /> Monthly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="progress-detail">
                    <span>Tasks Completed</span>
                    <strong>{userStats?.monthlyStats?.tasksCompleted || 0}</strong>
                  </div>
                  <div className="progress-detail">
                    <span>Time Spent</span>
                    <strong>{formatTime(userStats?.monthlyStats?.timeSpent || 0)}</strong>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personal">
            {/* Similar structure - keep using StatCard */}
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="grid-two">
              <Card className="progress-card">
                <CardHeader><CardTitle><Trophy /> Weekly Top Performers</CardTitle></CardHeader>
                <CardContent>
                  {weeklyLeaderboard.slice(0, 5).map((u, i) => (
                    <LeaderboardCard key={u.id} user={u} rank={i + 1} timeSpent={u.timeSpent} tasksCompleted={u.tasksCompleted} completionRate={u.completionRate} />
                  ))}
                </CardContent>
              </Card>
              <Card className="progress-card">
                <CardHeader><CardTitle><Award /> Monthly Top Performers</CardTitle></CardHeader>
                <CardContent>
                  {monthlyLeaderboard.slice(0, 5).map((u, i) => (
                    <LeaderboardCard key={u.id} user={u} rank={i + 1} timeSpent={u.timeSpent} tasksCompleted={u.tasksCompleted} completionRate={u.completionRate} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="categories-grid">
              {categoryStats.map((category) => (
                <CategoryCard
                  key={category.category}
                  category={category.category}
                  timeSpent={category.timeSpent}
                  completedTasks={category.completedTasks}
                  totalTasks={category.totalTasks}
                  completionRate={category.completionRate}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;

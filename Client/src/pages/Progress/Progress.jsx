import { useReducer, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  BarChart3,
  Timer,
} from "lucide-react";
import { useAuth } from "@/pages/Auth/contexts/AuthContext";
import { progressReducer, initialState } from "./context/Reducer";
import * as actions from "./context/Actions";
import StatCard from "./components/StatCard";
import LeaderboardCard from "./components/LeaderboardCard";
import CategoryCard from "./components/CategoryCard";
import "./Progress.css";

const Progress = () => {
  const [state, dispatch] = useReducer(progressReducer, initialState);
  const {
    userStats,
    weeklyLeaderboard,
    monthlyLeaderboard,
    categoryStats,
    activeTab,
    loading,
    error,
  } = state;

  const { user } = useAuth();

  // Fetch all progress data when user is available
  useEffect(() => {
    if (user?.id) {
      actions.fetchAllProgressData(dispatch, user.id);
    }
  }, [user]);

  // Event handlers using action creators
  const handleTabChange = (tab) => {
    actions.setActiveTab(dispatch, tab);
  };

  const handleRefreshData = () => {
    if (user?.id) {
      actions.fetchAllProgressData(dispatch, user.id);
    }
  };

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

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            Error: {error}
            <button onClick={handleRefreshData} style={{ marginLeft: "1rem" }}>
              Retry
            </button>
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="tabs"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal Stats</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="stats-grid">
              <StatCard
                title="Total Tasks"
                value={userStats?.totalTasks || 0}
                icon={Target}
              />
              <StatCard
                title="Completed"
                value={userStats?.completedTasks || 0}
                icon={CheckCircle2}
              />
              <StatCard
                title="Time Spent"
                value={actions.formatTime(userStats?.totalTimeSpent || 0)}
                icon={Timer}
              />
              <StatCard
                title="Completion Rate"
                value={`${userStats?.completionRate?.toFixed(1) || 0}%`}
                icon={TrendingUp}
              />
            </div>
            <div className="grid-two">
              <Card className="progress-card">
                <CardHeader>
                  <CardTitle>
                    <Calendar /> Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="progress-detail">
                    <span>Tasks Completed</span>
                    <strong>
                      {userStats?.weeklyStats?.tasksCompleted || 0}
                    </strong>
                  </div>
                  <div className="progress-detail">
                    <span>Time Spent</span>
                    <strong>
                      {actions.formatTime(
                        userStats?.weeklyStats?.timeSpent || 0
                      )}
                    </strong>
                  </div>
                </CardContent>
              </Card>
              <Card className="progress-card">
                <CardHeader>
                  <CardTitle>
                    <BarChart3 /> Monthly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="progress-detail">
                    <span>Tasks Completed</span>
                    <strong>
                      {userStats?.monthlyStats?.tasksCompleted || 0}
                    </strong>
                  </div>
                  <div className="progress-detail">
                    <span>Time Spent</span>
                    <strong>
                      {actions.formatTime(
                        userStats?.monthlyStats?.timeSpent || 0
                      )}
                    </strong>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personal">
            <div className="stats-grid">
              <StatCard
                title="Total Tasks"
                value={userStats?.totalTasks || 0}
                icon={Target}
                description="All time tasks"
              />
              <StatCard
                title="Completed"
                value={userStats?.completedTasks || 0}
                icon={CheckCircle2}
                description="Successfully finished"
              />
              <StatCard
                title="Time Spent"
                value={actions.formatTime(userStats?.totalTimeSpent || 0)}
                icon={Timer}
                description="Total working time"
              />
              <StatCard
                title="Completion Rate"
                value={`${userStats?.completionRate?.toFixed(1) || 0}%`}
                icon={TrendingUp}
                description="Success percentage"
              />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="grid-two">
              <Card className="progress-card">
                <CardHeader>
                  <CardTitle>
                    <Trophy /> Weekly Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weeklyLeaderboard.slice(0, 5).map((u, i) => (
                    <LeaderboardCard
                      key={u.id}
                      user={u}
                      rank={i + 1}
                      timeSpent={u.timeSpent}
                      tasksCompleted={u.tasksCompleted}
                      completionRate={u.completionRate}
                    />
                  ))}
                </CardContent>
              </Card>
              <Card className="progress-card">
                <CardHeader>
                  <CardTitle>
                    <Award /> Monthly Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyLeaderboard.slice(0, 5).map((u, i) => (
                    <LeaderboardCard
                      key={u.id}
                      user={u}
                      rank={i + 1}
                      timeSpent={u.timeSpent}
                      tasksCompleted={u.tasksCompleted}
                      completionRate={u.completionRate}
                    />
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

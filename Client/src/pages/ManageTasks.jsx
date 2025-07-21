import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  List,
  AlertCircle,
  PlayCircle,
  ArrowLeft,
} from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ManageTasks.css"; // Your custom CSS file
import { BackTop, Table } from "antd";
import TaskDetailModal from "../components/TaskDetails";

const mockTasks = [
  {
    id: 1,
    title: "Mathematics Study Session",
    description: "Algebra and Calculus Review",
    status: "active",
    startTime: "09:00",
    endTime: "11:00",
    date: new Date(),
    color: "#1e40af", // Tailwind "blue-900"
    icon: "📚",
    progress: 45,
  },
  {
    id: 2,
    title: "Physics Assignment",
    description: "Complete chapter 5 problems",
    status: "upcoming",
    startTime: "14:00",
    endTime: "16:00",
    date: new Date(),
    color: "#16a34a", // Tailwind "green-600"
    icon: "⚡",
    progress: 0,
  },
  {
    id: 3,
    title: "History Essay",
    description: "World War II research paper",
    status: "completed",
    startTime: "10:00",
    endTime: "12:00",
    date: new Date(Date.now() - 86400000),
    color: "#7c3aed", // Tailwind "purple-600"
    icon: "📝",
    progress: 100,
  },
  {
    id: 4,
    title: "Chemistry Lab Report",
    description: "Organic compounds analysis",
    status: "pending",
    startTime: "16:00",
    endTime: "18:00",
    date: new Date(Date.now() + 86400000),
    color: "#ea580c", // Tailwind "orange-600"
    icon: "🧪",
    progress: 25,
  },
];

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Start Time",
    dataIndex: "startTime",
    key: "startTime",
  },
  {
    title: "End Time",
    dataIndex: "endTime",
    key: "endTime",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];
export const ManageTasks = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const TaskCard = ({ task }) => (
    <Card>
      <CardContent>
        <div className="task-header">
          <div
            className="task-icon-container"
            style={{ backgroundColor: task.color }}
          >
            {task.icon}
          </div>
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.description}</p>
          </div>
          <Badge className={`task-badge ${task.status}`}>{task.status}</Badge>
        </div>
        <div className="task-time-progress">
          <span>
            {task.startTime} - {task.endTime}
          </span>
          <span>{task.progress}%</span>
        </div>
        <div className="task-progress-bar">
          <div
            className="task-progress-fill"
            style={{ width: `${task.progress}%`, backgroundColor: task.color }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );

  const groupedTasks = {
    active: [],
    upcoming: [],
    completed: [],
    pending: [],
  };

  mockTasks.forEach((task) => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  return (
    <div>
      <main className="main-content">
        <div className="tasks-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              onClick={() => navigate(-1)}
              style={{
                cursor: "pointer",
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10%",
                backgroundColor: "#323639",
              }}
            >
              <ArrowLeft className="icon" />
            </div>
            <h1 className="tasks-title">Tasks</h1>
          </div>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="icon" /> Add
          </Button>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView}>
          <div className="tabs-header">
            <TabsList>
              <TabsTrigger value="table">
                <List className="icon" /> Table
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarIcon className="icon" /> Calendar
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" className="filter-btn">
              <Filter className="icon" /> Filter
            </Button>
          </div>

          <TabsContent value="calendar">
            <div className="calendar-view">
              <Card className="calendar-card">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </CardContent>
              </Card>

              <Card className="tasks-calendar-card">
                <CardHeader>
                  <CardTitle>
                    Tasks for {selectedDate?.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="tasks-calendar-content">
                  {mockTasks
                    .filter(
                      (task) =>
                        task.date.toDateString() === selectedDate.toDateString()
                    )
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  {mockTasks.filter(
                    (task) =>
                      task.date.toDateString() === selectedDate.toDateString()
                  ).length === 0 && (
                    <div className="no-tasks-message">
                      <CalendarIcon className="icon-large" />
                      <p>No tasks scheduled for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="table">
            <Table
              rowKey="id"
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectedTask(record);
                    setIsModalVisible(true);
                  },
                };
              }}
              columns={columns}
              dataSource={mockTasks}
            />
          </TabsContent>
        </Tabs>
      </main>
      <AddTaskDialog
        open={isModalVisible}
        onOpenChange={setIsModalVisible}
        mode="view"
        task={selectedTask}
      />
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        mode="add"
      />
    </div>
  );
};

export default ManageTasks;

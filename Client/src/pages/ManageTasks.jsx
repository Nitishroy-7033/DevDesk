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
import { taskAPI } from "../lib/api";
import { use } from "react";

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
    title: "Repeat",
    dataIndex: "repeatCycleType",
    key: "RepeatCycleType",
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
  const [allTasks, setAllTasks] = useState([]);
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [activeView, setActiveView] = useState("table");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, [isLoggedIn, navigate]);

  const fetchTasks = async () => {
    try {
      // Replace with actual API call to fetch tasks
      const tasks = await taskAPI.getTasks();
      setAllTasks(tasks);
      console.log("Fetched tasks:", tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const getFilteredTasks = async (date) => {
    try {
      const tasks = await taskAPI.getTaskByDate(date);
      setCalendarTasks(tasks);
      // setAllTasks(tasks);
      console.log("Filtered tasks:", tasks);
    } catch (error) {
      console.error("Failed to fetch filtered tasks:", error);
    }
  };
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

  allTasks.forEach((task) => {
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
            <h1
              onClick={() => {
                fetchTasks();
              }}
              className="tasks-title"
            >
              Tasks
            </h1>
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
                    onSelect={(value) => {
                      if (value) {
                        setSelectedDate(value);
                        const year = value.getFullYear();
                        const month = String(value.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // getMonth is 0-based
                        const day = String(value.getDate()).padStart(2, "0");
                        const formattedDate = `${year}-${month}-${day}`;

                        console.log("Selected date (local):", formattedDate); // ✅ Correct date
                        getFilteredTasks(formattedDate);
                      }
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="tasks-calendar-card">
                <CardHeader>
                  <CardTitle>
                    Tasks for {selectedDate?.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="tasks-calendar-content space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Upcoming Tasks
                  </h2>

                  {calendarTasks.upcomingTasks?.length > 0 ? (
                    calendarTasks.upcomingTasks.map((task, index) => (
                      <div
                        key={index}
                        className="bg dark:bg-gray-800 shadow-md rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{task.task.iconName}</span>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {task.task.title}
                          </h3>
                        </div>

                        {task.task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {task.task.description}
                          </p>
                        )}

                        <div className="text-sm text-gray-700 dark:text-gray-400 flex flex-col sm:flex-row gap-2">
                          <span>
                            <strong>Start:</strong> {task.task.startTime}
                          </span>
                          <span>
                            <strong>End:</strong> {task.task.endTime}
                          </span>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-400 mt-2 flex flex-col sm:flex-row gap-2">
                          {/* Show Repeat if customRepeatDays is not present */}
                          {!task.task.customRepeatDays?.length && (
                            <span>
                              <strong>Repeat:</strong>{" "}
                              {task.task.repeatCycleType || "None"}
                            </span>
                          )}

                          {/* Show customRepeatDays if available */}
                          {task.task.customRepeatDays?.length > 0 && (
                            <span>
                              <strong>Repeat:</strong>{" "}
                              {task.task.customRepeatDays
                                .map((day) => {
                                  const dayMap = {
                                    1: "Monday",
                                    2: "Tuesday",
                                    3: "Wednesday",
                                    4: "Thursday",
                                    5: "Friday",
                                    6: "Saturday",
                                    7: "Sunday",
                                  };
                                  return dayMap[day] || `Day${day}`;
                                })
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      No upcoming tasks for this date.
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
              dataSource={allTasks}
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

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  BarChart3,
  LogIn,
  Search,
  Plus,
  MoreVertical,
  CheckCircle,
  Timer,
  PlayCircle,
} from "lucide-react";
import { Checkbox, Col, Input, Row } from "antd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, subDays, isToday } from "date-fns";
import { AddTaskDialog } from "../components/AddTaskDialog.jsx";
import LogHoursDialog from "../components/LogHoursDialog.jsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NoTaskMessage from "./Tasks/NoTaskMessage.jsx";
import "./UpcomingTasksPanel.css";
import { useTodo } from "@/contexts/TodoContext";
import { useTaskManager } from "@/hooks/useTaskManager";
import { useActiveTask } from "@/contexts/ActiveTaskContext";
import { calculateTaskDuration, formatTime } from "@/utils/timeUtils";
import { taskAPI } from "@/lib/api";
import DemoModeBanner from "./DemoModeBanner.jsx";
interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  icon: string;
  status: "pending" | "completed" | "active";
}

export const UpcomingTasksPanel = () => {
  const { tasks, loading, error, completeTask } = useTodo();
  const { fetchTasks } = useTaskManager();
  const {
    setActiveTaskFromUpcoming,
    setAvailableTasksAndAutoSelect,
    activeTask,
  } = useActiveTask();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoggedIn, logout } = useAuth();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Pending");

  const handleLogout = () => {
    logout();
    navigate("/");
    setStatusFilter("Pending");
    fetchTasks([]); // Clear the todo list
  };

  const handleLogHours = (task) => {
    setSelectedTask(task);
    setIsLogHoursOpen(true);
  };

  const handleCompleteTask = async (task) => {
    try {
      const completionRequest = {
        taskId: task.id,
        completionDate: new Date().toISOString(),
        notes: "",
        completionType: "Manual",
      };

      console.log("Sending completion request:", completionRequest);

      // Use the TodoContext completeTask method which handles both demo and real mode
      const result = await completeTask(completionRequest);
      console.log("Task completion response:", result);

      // Show success message
      if (isLoggedIn) {
        alert("Task completed successfully!");
      } else {
        alert("Demo task completed! Login to save your real tasks.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert(`${error.message}`);
    }
  };

  const handleSetActiveTask = (task) => {
    setActiveTaskFromUpcoming(task);
  };

  const getUpcomingTask = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetchTasks(today, statusFilter);
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
    }
  };
  function formatTimeUtil(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // const seconds = totalSeconds % 60;

    // Pad with 0 if needed
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  }
  const formatTime = (timeStr) => {
    // Remove the :00 seconds using regex
    return timeStr.replace(/:00\s/, " ");
  };

  useEffect(() => {
    getUpcomingTask();
  }, [statusFilter]);

  // Auto-set first task as active when tasks are loaded and no active task exists
  useEffect(() => {
    if (tasks.length > 0) {
      setAvailableTasksAndAutoSelect(tasks);
    }
  }, [tasks, setAvailableTasksAndAutoSelect]);

  return (
    <>
      {/* <DemoModeBanner /> */}
      <Card className="card-container">
        <CardHeader className="flex justify-between ">
          <CardTitle className=" flex  justify-between">
            <div
              style={{
                gap: "10px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Calendar width={"20px"} />
              <p
                style={{
                  fontSize: "16px",
                }}
              >
                Tasks List{" "}
                <span style={{ color: "grey" }}>({tasks.length} tasks)</span>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <div>
                {isLoggedIn ? (
                  <div
                    onClick={() => setIsAddTaskOpen(true)}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#3b7be3",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Plus color="white" />
                  </div>
                ) : (
                  ""
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "100px",
                    }}
                  >
                    <Avatar>
                      <AvatarFallback>
                        <User className="avatar-icon" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate("/manage-tasks")}
                      >
                        <Settings className="menu-icon" />
                        Manage Tasks
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="logout-item"
                      >
                        <LogIn className="menu-icon" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      <LogIn className="menu-icon" />
                      Login
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent
          style={{
            height: "70vh",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div>Loading tasks...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : tasks.length === 0 ? (
            <NoTaskMessage />
          ) : (
            <div className="flex flex-col gap-4 ">
              {/* Sort tasks: non-completed first, then completed */}
              {tasks
                .sort((a, b) => {
                  // If both are completed or both are not completed, maintain original order
                  if ((a.isCompleted || a.status === "completed") === (b.isCompleted || b.status === "completed")) {
                    return 0;
                  }
                  // Put non-completed tasks first
                  return (a.isCompleted || a.status === "completed") ? 1 : -1;
                })
                .map((task) => {
                  const isTaskCompleted = task.isCompleted || task.status === "completed";
                  
                  return (
                    <div
                      onClick={() => !isTaskCompleted && handleSetActiveTask(task)}
                      key={task.id}
                      className={`shadow-md rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 ${
                        !isTaskCompleted ? 'cursor-pointer' : 'cursor-default opacity-70'
                      }`}
                    >
                      <Row style={{ gap: "10px", width: "100%" }} align={"middle"}>
                        <div
                          style={{
                            fontSize: "30px",
                            height: "60px",
                            width: "60px",
                            display: "flex",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            justifyItems: "center",
                            borderRadius: "15px",
                          }}
                        >
                          {task.iconName}
                        </div>
                        <Col
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "2px",
                              fontSize: "20px",
                            }}
                          >
                            <span style={{ 
                              textDecoration: isTaskCompleted ? 'line-through' : 'none',
                              color: isTaskCompleted ? '#888' : 'inherit'
                            }}>
                              {task.title}
                            </span>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              {activeTask?.id === task.id && !isTaskCompleted && (
                                <span className="blinking-dot"></span>
                              )}

                              {/* Show green circle for completed tasks, complete button for others */}
                              {isTaskCompleted ? (
                                <div
                                  style={{
                                    padding: "6px",
                                    backgroundColor: "#52c41a",
                                    border: "1px solid #52c41a",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  title="Task Completed"
                                >
                                  <CheckCircle size={16} color="white" />
                                </div>
                              ) : (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteTask(task);
                                  }}
                                  style={{
                                    padding: "6px",
                                    backgroundColor: "#52c41a",
                                    border: "1px solid #444444",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  title="Complete Task"
                                >
                                  <CheckCircle size={16} color="white" />
                                </div>
                              )}
                            </div>
                          </div>

                      <Row justify={"space-between"} align={"middle"}>
                        <div style={{ 
                          textDecoration: isTaskCompleted ? 'line-through' : 'none',
                          color: isTaskCompleted ? '#888' : 'inherit'
                        }}>
                          {task.description}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#2d3748",
                              padding: "2px 8px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              color: isTaskCompleted ? "#666" : "#a0a0a0",
                            }}
                          >
                            {formatTime(task.startTime)} -{" "}
                            {formatTime(task.endTime)}
                          </span>
                          <span
                            style={{
                              backgroundColor: "#4a5568",
                              padding: "2px 8px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              color: isTaskCompleted ? "#666" : "#cbd5e0",
                            }}
                          >
                            {formatTimeUtil(
                              calculateTaskDuration(
                                task.startTime,
                                task.endTime
                              )
                            )}
                          </span>
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </div>
                  );
                })}
            </div>
          )}
          <AddTaskDialog
            open={isAddTaskOpen}
            onOpenChange={setIsAddTaskOpen}
            mode="add"
          />

          {selectedTask && (
            <>
              <LogHoursDialog
                isOpen={isLogHoursOpen}
                onClose={() => setIsLogHoursOpen(false)}
                task={selectedTask}
                executionDate={format(selectedDate, "yyyy-MM-dd")}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

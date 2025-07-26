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
} from "lucide-react";
import { Checkbox, Col, Input, Row } from "antd";
import { FaFilter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, subDays, isToday } from "date-fns";
import { AddTaskDialog } from "../components/AddTaskDialog.jsx";
import LogHoursDialog from "../components/LogHoursDialog.jsx";
import CompleteTaskDialog from "../components/CompleteTaskDialog.jsx";

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
import NoTaskMessage from "../components/NoTaskMessage.jsx";
import "./UpcomingTasksPanel.css";
import { useTodo } from "@/contexts/TodoContext";
import { useTaskManager } from "@/hooks/useTaskManager";
interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  icon: string;
  status: "pending" | "completed" | "active";
}

export const UpcomingTasksPanel = () => {
  const { tasks, loading, error } = useTodo();
  const { fetchTasks } = useTaskManager();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoggedIn, logout } = useAuth();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [isCompleteTaskOpen, setIsCompleteTaskOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const handleLogout = () => {
    logout();
    navigate("/");
    setStatusFilter("All");
    fetchTasks([]); // Clear the todo list
  };

  const handleLogHours = (task) => {
    setSelectedTask(task);
    setIsLogHoursOpen(true);
  };

  const handleCompleteTask = (task) => {
    setSelectedTask(task);
    setIsCompleteTaskOpen(true);
  };

  const handleTaskCompleted = (completedTask) => {
    // Refresh the tasks list after completion
    getUpcomingTask();
  };

  const getUpcomingTask = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetchTasks(today, statusFilter);
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
    }
  };

  useEffect(() => {
    getUpcomingTask();
  }, [statusFilter]);
  return (
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

            {/* Status Filter */}

            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Skipped">Skipped</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            {/* <ThemeToggle /> */}

            {/* <Input
              placeholder="Search here.."
              onChange={(value) => {
                setSearchText(value.target.value);
              }}
              style={{
                // padding: "5px",
                fontSize: "20px",
                fontWeight: "normal",
                backgroundColor: "#323639",
                border: "1px solid #444444",
                borderRadius: "10px",
                color: "white",
              }}
            /> */}
            <div
              onClick={() => {}}
              style={{
                padding: "10px",
                backgroundColor: "#323639",
                border: "1px solid #444444",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              <Search color="grey" />
            </div>
            <div>
              {isLoggedIn ? (
                <div
                  onClick={() => setIsAddTaskOpen(true)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#3b7be3",
                    borderRadius: "15px",
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
                    <DropdownMenuItem onClick={() => navigate("/manage-tasks")}>
                      <Settings className="menu-icon" />
                      Manage Tasks
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => navigate("/progress")}>
                      <BarChart3 className="menu-icon" />
                      Progress
                    </DropdownMenuItem> */}
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
          <div className="flex flex-col gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="  dark:bg-gray-800 shadow-md rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
              >
                {/* Checkbox */}
                <div className="scale-150">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    readOnly
                  />
                </div>

                {/* Icon */}
                <div className=" text-white text-2xl w-14 h-14 flex items-center justify-center rounded-xl">
                  {task.iconName}
                </div>

                {/* Task Details */}
                <div className="flex-1">
                  {/* Title */}
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </div>

                  {/* Description & Time */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1">
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {task.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {task.startTime} - {task.endTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

            <CompleteTaskDialog
              isOpen={isCompleteTaskOpen}
              onClose={() => setIsCompleteTaskOpen(false)}
              task={selectedTask}
              executionDate={format(selectedDate, "yyyy-MM-dd")}
              onTaskCompleted={handleTaskCompleted}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

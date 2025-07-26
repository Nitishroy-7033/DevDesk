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
            {
              isLoggedIn ? (
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
              ) : ""
            }
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
          <div
            style={{
              gap: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {tasks.map((task) => (
              <Row
                key={task.id}
                style={{
                  padding: "10px 0px",
                }}
              >
                <Row style={{ gap: "10px", width: "100%" }} align={"middle"}>
                  <div className="scale-150">
                    <Checkbox
                      checked={task.status === "completed"}
                      className="custom-checkbox"
                    />
                  </div>

                  <div
                    style={{
                      backgroundColor: "#4e4e4eff",
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
                        fontSize: "20px",
                      }}
                    >
                      {task.title}
                    </div>
                    <Row justify={"space-between"}>
                      <div>{task.description}</div>
                      <div>
                        {task.startTime} - {task.endTime}
                      </div>
                    </Row>
                  </Col>
                  
                  {/* Action buttons */}
                  {/* <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLogHours(task)}
                      style={{ padding: "8px", minWidth: "auto" }}
                    >
                      <Timer size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteTask(task)}
                      style={{ padding: "8px", minWidth: "auto" }}
                    >
                      <CheckCircle size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          style={{ padding: "8px", minWidth: "auto" }}
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleLogHours(task)}>
                          <Timer className="mr-2" size={16} />
                          Log Hours
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCompleteTask(task)}>
                          <CheckCircle className="mr-2" size={16} />
                          Complete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div> */}
                </Row>
              </Row>
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
              executionDate={format(selectedDate, 'yyyy-MM-dd')}
            />
            
            <CompleteTaskDialog
              isOpen={isCompleteTaskOpen}
              onClose={() => setIsCompleteTaskOpen(false)}
              task={selectedTask}
              executionDate={format(selectedDate, 'yyyy-MM-dd')}
              onTaskCompleted={handleTaskCompleted}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

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
} from "lucide-react";
import { Checkbox, Col, Input, Row } from "antd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, subDays, isToday } from "date-fns";
import { AddTaskDialog } from "../components/AddTaskDialog.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NoTaskMessage from "../components/NoTaskMessage.jsx";
import "./UpcomingTasksPanel.css";
import { useTodo } from "@/contexts/TodoContext";
import axios from "axios";
interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  icon: string;
  status: "pending" | "completed" | "active";
}

export const UpcomingTasksPanel = () => {
  const { tasks, loading, error, fetchTasksForUserAsync } = useTodo();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoggedIn, logout } = useAuth();
  const [upcomingTask, setUpComingTask] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const getUpcomingTask = async () => {
    const userId = localStorage.getItem("userId");
    const today = new Date().toISOString().split("T")[0];
    console.log("Get Todo");

    const response = await axios.get(
      `http://localhost:5175/Task/upcoming-task?date=${today}`
    );
    setUpComingTask(response.data);
    console.log(response);
  };

  useEffect(() => {
    getUpcomingTask();
  }, []);
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
              Tasks List <span style={{ color: "grey" }}>(6 tasks)</span>
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
        {upcomingTask.length === 0 ? (
          <NoTaskMessage />
        ) : (
          <div
            style={{
              gap: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {upcomingTask.map((task) => (
              <Row
                style={{
                  padding: "10px 0px",
                  // backgroundColor: "red",
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
                      width: "80%",
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
      </CardContent>
    </Card>
  );
};

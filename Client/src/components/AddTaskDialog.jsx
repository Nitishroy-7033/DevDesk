import { useEffect, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import {
  X,
  Clock,
  Repeat,
  Palette,
  Smile,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import apiClient from "./../lib/ApiClient";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Col, Row } from "antd";

const colors = [
  { name: "Blue", value: "bg-primary", color: "hsl(217 91% 60%)" },
  { name: "Green", value: "bg-secondary", color: "hsl(142 76% 36%)" },
  { name: "Yellow", value: "bg-warning", color: "hsl(38 92% 50%)" },
  { name: "Red", value: "bg-destructive", color: "hsl(0 84% 60%)" },
  { name: "Purple", value: "bg-purple-500", color: "hsl(271 91% 65%)" },
  { name: "Orange", value: "bg-orange-500", color: "hsl(20 90% 48%)" },
];

const icons = ["📚", "⚛️", "✍️", "🧮", "🔬", "🎨", "💻", "🎵", "🏃‍♂️", "🧘‍♀️"];

const repeatOptions = [
  { label: "No Repeat", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Custom", value: "custom" },
];

const weekDays = [
  { label: "SUN", value: 0 },
  { label: "MON", value: 1 },
  { label: "TUE", value: 2 },
  { label: "WED", value: 3 },
  { label: "THU", value: 4 },
  { label: "FRI", value: 5 },
  { label: "SAT", value: 6 },
];

export const AddTaskDialog = ({
  open,
  onOpenChange,
  mode = "add",
  task = null,
}) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [icon, setIcon] = useState("");
  const [repeatType, setRepeatType] = useState("daily");
  const [repeatDays, setRepeatDays] = useState([]);

  // Calculate duration between start and end time
  const calculateDuration = () => {
    if (!startTime || !endTime) return null;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end - start;

    if (diffInMs <= 0) return null;

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else {
      return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }`;
    }
  };

  // Calculate date range duration
  const calculateDateRangeDuration = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;

    if (diffInMs < 0) return null;

    const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  // Validation functions
  const validateTimeRange = () => {
    if (!startTime || !endTime) return { isValid: true, message: "" };

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end - start;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMs <= 0) {
      return { isValid: false, message: "End time must be after start time" };
    }

    if (diffInMinutes < 5) {
      return {
        isValid: false,
        message: "Task duration must be at least 5 minutes",
      };
    }

    return { isValid: true, message: "" };
  };

  const validateDateRange = () => {
    if (!startDate || !endDate) return { isValid: true, message: "" };

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return {
        isValid: false,
        message: "End date cannot be before start date",
      };
    }

    return { isValid: true, message: "" };
  };

  const timeValidation = validateTimeRange();
  const dateValidation = validateDateRange();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime(null);
    setEndTime(null);
    setStartDate(new Date());
    setEndDate(new Date());
    setIcon("");
    setRepeatType("daily");
    setRepeatDays([]);
  };

  const addTaskAsync = async () => {
    // Validate title
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    // Validate time range
    const timeValidation = validateTimeRange();
    if (!timeValidation.isValid) {
      toast({
        title: "Error",
        description: timeValidation.message,
        variant: "destructive",
      });
      return;
    }

    // Validate date range
    const dateValidation = validateDateRange();
    if (!dateValidation.isValid) {
      toast({
        title: "Error",
        description: dateValidation.message,
        variant: "destructive",
      });
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    const newTask = {
      userId,
      title,
      description,
      startTime: startTime?.toLocaleTimeString(),
      endTime: endTime?.toLocaleTimeString(),
      fromDate: startDate?.toISOString().split("T")[0],
      toDate: endDate?.toISOString().split("T")[0],
      iconName: icon,
      repeatCycleType: repeatType,
      customRepeatDays: repeatDays,
    };

    try {
      setLoading(true);
      const response = await apiClient.post("/task", newTask);

      if (response.status === 200) {
        toast({
          title: "✅ Task Created",
          description: "Task created successfully.",
        });
        resetForm();
        onOpenChange(false);
      } else {
        throw new Error("Server returned non-200 status");
      }
    } catch (error) {
      console.error("[❌] Task Creation Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border border-border shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <div
              htmlFor="title"
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#707377ff",
              }}
            >
              Title *
            </div>
            <Input
              id="title"
              placeholder="Enter task title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <div
              htmlFor="description"
              style={{
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#707377ff",
              }}
            >
              Description{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </div>
            <Textarea
              id="description"
              placeholder="Add a description for your task..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Task Time Range */}
          <div className="space-y-3">
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                fontSize: "14px",
                alignContent: "center",
                alignItems: "center",
                fontWeight: "500",
                color: "#707377ff",
              }}
            >
              <Clock className="w-4 h-4" />
              Task Time
            </div>
            <Row justify={"space-between"}>
              <Col>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#707377ff",
                  }}
                >
                  Start Time
                </div>
                <DatePicker
                  selected={startTime}
                  onChange={(time) => setStartTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Select start time"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    !timeValidation.isValid && startTime && endTime
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />
              </Col>
              <Col>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#707377ff",
                  }}
                >
                  End Time
                </div>
                <DatePicker
                  selected={endTime}
                  onChange={(time) => setEndTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Select end time"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    !timeValidation.isValid && startTime && endTime
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />
              </Col>
            </Row>
            {/* Time Duration Display */}
            {calculateDuration() && timeValidation.isValid && (
              <div className="mt-2 p-3 bg-muted/20 border border-border rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Duration:</span>{" "}
                  {calculateDuration()}
                </p>
              </div>
            )}
            {/* Time Validation Error */}
            {!timeValidation.isValid && startTime && endTime && (
              <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  <span className="font-medium">Error:</span>{" "}
                  {timeValidation.message}
                </p>
              </div>
            )}
          </div>

          {/* Repeat Cycle */}
          <div className="space-y-3">
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignContent: "center",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#707377ff",
              }}
            >
              <Repeat className="w-4 h-4" />
              Repeat Cycle
            </div>
            <Select value={repeatType} onValueChange={setRepeatType}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select repeat option" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border shadow-lg">
                {repeatOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-foreground hover:bg-muted"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom Repeat Days */}
            {repeatType === "custom" && (
              <div className="space-y-2 mt-3">
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#707377ff",
                  }}
                >
                  Select Days
                </div>
                <Row justify={"space-between"}>
                  {weekDays.map((day) => {
                    const isSelected = repeatDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        style={{
                          padding: "10px 15px",
                        }}
                        type="button"
                        onClick={() => {
                          const updatedDays = isSelected
                            ? repeatDays.filter((d) => d !== day.value)
                            : [...repeatDays, day.value];
                          setRepeatDays(updatedDays);
                        }}
                        className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </Row>
              </div>
            )}
          </div>

          {/* Task Date Range */}
          <div className="space-y-3">
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignContent: "center",
                alignItems: "center",
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#707377ff",
              }}
            >
              <Calendar className="w-4 h-4" />
              Task Date Range
            </div>
            <Row justify={"space-between"}>
              <div className="space-y-2">
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#707377ff",
                  }}
                >
                  Start Date
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Select start date"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    !dateValidation.isValid && startDate && endDate
                      ? "border-destructive"
                      : "border-border"
                  }`}
                  dateFormat="MMM dd, yyyy"
                />
              </div>
              <div className="space-y-2">
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#707377ff",
                  }}
                >
                  End Date
                </div>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Select end date"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    !dateValidation.isValid && startDate && endDate
                      ? "border-destructive"
                      : "border-border"
                  }`}
                  dateFormat="MMM dd, yyyy"
                />
              </div>
            </Row>
            {/* Date Range Duration Display */}
            {calculateDateRangeDuration() && dateValidation.isValid && (
              <div className="mt-2 p-3 bg-muted/20 border border-border rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Task will run for:</span>{" "}
                  {calculateDateRangeDuration()}
                </p>
              </div>
            )}
            {/* Date Validation Error */}
            {!dateValidation.isValid && startDate && endDate && (
              <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  <span className="font-medium">Error:</span>{" "}
                  {dateValidation.message}
                </p>
              </div>
            )}
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignContent: "center",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#707377ff",
              }}
            >
              <Smile className="w-4 h-4" />
              Choose Icon
            </div>
            <Row style={{ gap: "10px" }}>
              {icons.map((item) => (
                <button
                  style={{ padding: "8px" }}
                  type="button"
                  onClick={() => setIcon(item)}
                  className={`w-12 h-12 rounded-lg border transition-all flex items-center justify-center text-xl hover:scale-105 ${
                    icon === item
                      ? "border-primary bg-primary/10 scale-110 shadow-lg"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {item}
                </button>
              ))}
            </Row>
          </div>

          {/* Action Buttons */}
          <Row justify={"end"} style={{ marginTop: "10px" }}>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              style={{
                marginRight: "10px",
                padding: "10px 20px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addTaskAsync}
              // disabled={
              //   loading ||
              //   !title.trim() ||
              //   !timeValidation.isValid ||
              //   !dateValidation.isValid
              // }
              style={{
                padding: "10px 20px",
              }}
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </Row>
        </div>
      </DialogContent>
    </Dialog>
  );
};

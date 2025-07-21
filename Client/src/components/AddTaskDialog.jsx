import { useEffect, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { X, Clock, Repeat, Palette, Smile } from "lucide-react";
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
import apiClient from "./../lib/ApiClient";
import { DatePicker, Space, TimePicker } from "antd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
// ... imports remain unchanged

export const AddTaskDialog = ({
  open,
  onOpenChange,
  mode = "add",
  task = null,
}) => {
  const { RangePicker } = DatePicker;
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [icon, setIcon] = useState("");
  const [repeatType, setRepeatType] = useState("daily");
  const [repeatDays, setRepeatDays] = useState([]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setStartDate("");
    setEndDate("");
    setIcon("");
    setRepeatType("daily");
    setRepeatDays([]);
  };

  const addTaskAsync = async () => {
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
      startTime,
      endTime,
      fromDate: startDate,
      toDate: endDate,
      iconName: icon,
      repeatCycleType: repeatType,
      customRepeatDays: repeatDays,
    };

    console.log("[📦] New Task Payload:", newTask);

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
      <DialogContent className="sm:max-w-[600px] bg-card border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter task title..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="bg-background border-input"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Add a description for your task..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="bg-background border-input min-h-[80px]"
          />
        </div>

        {/* Time Picker */}
        <Label className="text-sm font-medium">Time</Label>
        <TimePicker.RangePicker
          use12Hours
          format="h:mm a"
          size="large"
          style={{
            width: "100%",
            backgroundColor: "#2f2e33",
            color: "white",
            border: "none",
          }}
          onChange={(time, timeString) => {
            setStartTime(timeString[0]);
            setEndTime(timeString[1]);
          }}
          prefix={<SmileOutlined color="white" />}
        />

        {/* Repeat Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Repeat className="w-4 h-4" />
            Repeat
          </Label>
          <Select value={repeatType} onValueChange={setRepeatType}>
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select repeat option" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg">
              {repeatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Repeat Days (custom only) */}
        {repeatType === "custom" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Repeat Days</Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const isSelected = repeatDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      const updatedDays = isSelected
                        ? repeatDays.filter((d) => d !== day.value)
                        : [...repeatDays, day.value];
                      setRepeatDays(updatedDays);
                    }}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-background border-muted hover:border-primary/50"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Date Range Picker */}
        <Label className="text-sm font-medium">Date Range</Label>
        <RangePicker
          size="large"
          onChange={(date, dateString) => {
            setStartDate(dateString[0]);
            setEndDate(dateString[1]);
          }}
          style={{
            width: "100%",
            backgroundColor: "#2f2e33",
            color: "white",
            border: "none",
          }}
        />

        {/* Icon Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-1">
            <Smile className="w-4 h-4" />
            Icon
          </Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {icons.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setIcon(item)}
                className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center text-lg ${
                  icon === item
                    ? "border-primary bg-primary/10 scale-110"
                    : "border-muted hover:border-primary/50 hover:scale-105"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{ gap: "20px", display: "flex", justifyContent: "flex-end" }}
        >
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={addTaskAsync} disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

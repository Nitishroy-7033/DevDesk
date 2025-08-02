import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Rate,
  Select,
  Button,
  Divider,
  Row,
  Col,
  Tag,
  Card,
  Badge,
} from "antd";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Timer,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import { useActiveTask } from "@/contexts/ActiveTaskContext";
import { useTodo } from "@/contexts/TodoContext";

const { TextArea } = Input;
const { Option } = Select;

const EnhancedCompleteTaskDialog = ({
  isOpen,
  onClose,
  task,
  executionDate,
  onTaskCompleted,
  completionMethod = "manual", // "countdown" or "manual"
  timerData = null, // { startTime, endTime, duration, wasUsingTimer }
}) => {
  const { activeTask, taskStartTime, taskEndTime } = useActiveTask();
  const { completeTask } = useTodo();

  const [formData, setFormData] = useState({
    completionPercentage: 100,
    notes: "",
    completionQuality: "good",
    productivityLevel: "normal",
    interruptionCount: 0,
    interruptionReasons: [],
  });

  const [completionData, setCompletionData] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate completion analytics
  useEffect(() => {
    if (task && (timerData || (taskStartTime && taskEndTime))) {
      const analytics = calculateCompletionAnalytics();
      setCompletionData(analytics);
    }
  }, [task, timerData, taskStartTime, taskEndTime]);

  const calculateCompletionAnalytics = () => {
    const expectedDuration = task?.expectedDurationMinutes || 60;
    const startTime = timerData?.startTime || taskStartTime;
    const endTime = timerData?.endTime || taskEndTime;

    if (!startTime || !endTime) return {};

    const actualStartTime = new Date(startTime);
    const actualEndTime = new Date(endTime);
    const actualDurationMinutes = Math.round(
      (actualEndTime - actualStartTime) / (1000 * 60)
    );

    // Parse task scheduled time
    const [startHour, startMinute] = task.startTime.split(":").map(Number);
    const [endHour, endMinute] = task.endTime.split(":").map(Number);

    const scheduledStart = new Date(actualStartTime);
    scheduledStart.setHours(startHour, startMinute, 0, 0);

    const scheduledEnd = new Date(actualStartTime);
    scheduledEnd.setHours(endHour, endMinute, 0, 0);

    // Calculate variances
    const startVarianceMinutes = Math.round(
      (actualStartTime - scheduledStart) / (1000 * 60)
    );
    const endVarianceMinutes = Math.round(
      (actualEndTime - scheduledEnd) / (1000 * 60)
    );
    const durationVarianceMinutes = expectedDuration - actualDurationMinutes;

    // Determine timing categories
    const startedEarly = startVarianceMinutes < -5;
    const startedLate = startVarianceMinutes > 5;
    const startedOnTime = Math.abs(startVarianceMinutes) <= 5;

    const completedEarly = endVarianceMinutes < -5;
    const completedLate = endVarianceMinutes > 5;
    const completedOnTime = Math.abs(endVarianceMinutes) <= 5;

    const completedLessThanExpected = durationVarianceMinutes > 5;
    const completedMoreThanExpected = durationVarianceMinutes < -5;
    const completedExactlyAsExpected = Math.abs(durationVarianceMinutes) <= 5;

    const efficiencyScore =
      expectedDuration > 0 ? expectedDuration / actualDurationMinutes : 1.0;

    return {
      expectedDurationMinutes: expectedDuration,
      actualDurationMinutes,
      startVarianceMinutes,
      endVarianceMinutes,
      durationVarianceMinutes,
      startedEarly,
      startedLate,
      startedOnTime,
      completedEarly,
      completedLate,
      completedOnTime,
      completedLessThanExpected,
      completedMoreThanExpected,
      completedExactlyAsExpected,
      efficiencyScore,
      actualStartTime,
      actualEndTime,
    };
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const completionRequest = {
        taskId: task.id,
        completionDate: new Date().toISOString(),
        notes: formData.notes,
        completionType: completionMethod === "countdown" ? "Timer" : "Manual",
      };

      console.log("Sending completion request:", completionRequest);

      // Use TodoContext to complete the task
      await completeTask(completionRequest);

      onTaskCompleted?.(task);
      onClose();
    } catch (error) {
      console.error("Error completing task:", error);
      alert(`Error completing task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getVarianceBadge = (variance, type) => {
    if (Math.abs(variance) <= 5) {
      return <Badge status="success" text={`On Time (${type})`} />;
    } else if (variance > 0) {
      return <Badge status="warning" text={`${variance}m Late (${type})`} />;
    } else {
      return (
        <Badge
          status="processing"
          text={`${Math.abs(variance)}m Early (${type})`}
        />
      );
    }
  };

  const getEfficiencyColor = (score) => {
    if (score >= 1.2) return "#52c41a"; // Green - very efficient
    if (score >= 0.8) return "#1890ff"; // Blue - good
    if (score >= 0.6) return "#fa8c16"; // Orange - needs improvement
    return "#f5222d"; // Red - inefficient
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500" size={20} />
          <span>Complete Task: {task?.title}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="complete"
          type="primary"
          loading={loading}
          onClick={handleComplete}
          className="bg-green-500 hover:bg-green-600"
        >
          Complete Task
        </Button>,
      ]}
    >
      <div className="space-y-6">
        {/* Performance Analytics */}
        {Object.keys(completionData).length > 0 && (
          <Card title="Performance Analytics" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {formatDuration(completionData.actualDurationMinutes)}
                  </div>
                  <div className="text-sm text-gray-500">Actual Duration</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {formatDuration(completionData.expectedDurationMinutes)}
                  </div>
                  <div className="text-sm text-gray-500">Expected Duration</div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{
                      color: getEfficiencyColor(completionData.efficiencyScore),
                    }}
                  >
                    {(completionData.efficiencyScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">Efficiency Score</div>
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Timing Analysis */}
            <div className="space-y-2">
              <h4 className="font-semibold">Timing Analysis</h4>
              <div className="space-y-1">
                {getVarianceBadge(completionData.startVarianceMinutes, "Start")}
                {getVarianceBadge(completionData.endVarianceMinutes, "End")}
                {getVarianceBadge(
                  completionData.durationVarianceMinutes,
                  "Duration"
                )}
              </div>
            </div>

            {/* Completion Method */}
            <div className="mt-4">
              <Tag color={completionMethod === "countdown" ? "green" : "blue"}>
                {completionMethod === "countdown" ? (
                  <>
                    <Timer size={14} className="inline mr-1" />
                    Timer Completed
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} className="inline mr-1" />
                    Manual Completion
                  </>
                )}
              </Tag>
            </div>
          </Card>
        )}

        {/* Completion Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Completion Percentage
            </label>
            <Select
              value={formData.completionPercentage}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  completionPercentage: value,
                }))
              }
              className="w-full"
            >
              <Option value={100}>100% - Fully Complete</Option>
              <Option value={90}>90% - Nearly Complete</Option>
              <Option value={75}>75% - Mostly Complete</Option>
              <Option value={50}>50% - Half Complete</Option>
              <Option value={25}>25% - Partially Complete</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quality Rating
            </label>
            <Select
              value={formData.completionQuality}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, completionQuality: value }))
              }
              className="w-full"
            >
              <Option value="excellent">
                <Award className="inline mr-1" size={14} />
                Excellent
              </Option>
              <Option value="good">
                <TrendingUp className="inline mr-1" size={14} />
                Good
              </Option>
              <Option value="average">
                <Target className="inline mr-1" size={14} />
                Average
              </Option>
              <Option value="poor">
                <TrendingDown className="inline mr-1" size={14} />
                Poor
              </Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Productivity Level
            </label>
            <Select
              value={formData.productivityLevel}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, productivityLevel: value }))
              }
              className="w-full"
            >
              <Option value="high">High Productivity</Option>
              <Option value="normal">Normal Productivity</Option>
              <Option value="low">Low Productivity</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Interruptions
            </label>
            <Select
              value={formData.interruptionCount}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, interruptionCount: value }))
              }
              className="w-full"
            >
              <Option value={0}>No Interruptions</Option>
              <Option value={1}>1 Interruption</Option>
              <Option value={2}>2 Interruptions</Option>
              <Option value={3}>3+ Interruptions</Option>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes (Optional)
          </label>
          <TextArea
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Add any notes about this task completion..."
          />
        </div>

        {/* Task Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Task Summary</h4>
          <div className="text-sm space-y-1">
            <div>
              <strong>Scheduled:</strong> {task?.startTime} - {task?.endTime}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {format(new Date(executionDate), "MMM dd, yyyy")}
            </div>
            {completionData.actualStartTime && (
              <div>
                <strong>Actual:</strong>{" "}
                {format(completionData.actualStartTime, "HH:mm")} -{" "}
                {format(completionData.actualEndTime, "HH:mm")}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EnhancedCompleteTaskDialog;

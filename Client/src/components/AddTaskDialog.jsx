import { useReducer, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addTaskReducer, initialState } from "./AddTaskDialog/context/Reducer";
import * as actions from "./AddTaskDialog/context/Actions";
import TaskBasicFields from "./AddTaskDialog/components/TaskBasicFields";
import TaskTimeFields from "./AddTaskDialog/components/TaskTimeFields";
import TaskDateFields from "./AddTaskDialog/components/TaskDateFields";
import TaskIconSelector from "./AddTaskDialog/components/TaskIconSelector";
import TaskRepeatFields from "./AddTaskDialog/components/TaskRepeatFields";
import "./AddTaskDialog.css";

export const AddTaskDialog = ({
  open,
  onOpenChange,
  mode = "add",
  task = null,
}) => {
  const [state, dispatch] = useReducer(addTaskReducer, initialState);
  const {
    title,
    description,
    startTime,
    endTime,
    startDate,
    endDate,
    icon,
    repeatType,
    repeatDays,
    loading,
    error,
    validationErrors,
    duration,
  } = state;

  const { toast } = useToast();

  // Load task data when editing
  useEffect(() => {
    if (mode === "edit" && task && open) {
      actions.setTaskData(dispatch, task);
    } else if (mode === "add" && open) {
      actions.resetForm(dispatch);
    }
  }, [mode, task, open]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      actions.resetForm(dispatch);
    }
  }, [open]);

  // Event handlers
  const handleTitleChange = (value) => {
    actions.setTitle(dispatch, value);
  };

  const handleDescriptionChange = (value) => {
    actions.setDescription(dispatch, value);
  };

  const handleStartTimeChange = (time) => {
    actions.setStartTime(dispatch, time);
  };

  const handleEndTimeChange = (time) => {
    actions.setEndTime(dispatch, time);
  };

  const handleStartDateChange = (date) => {
    actions.setStartDate(dispatch, date);
  };

  const handleEndDateChange = (date) => {
    actions.setEndDate(dispatch, date);
  };

  const handleIconChange = (selectedIcon) => {
    actions.setIcon(dispatch, selectedIcon);
  };

  const handleRepeatTypeChange = (type) => {
    actions.setRepeatType(dispatch, type);
  };

  const handleRepeatDaysChange = (days) => {
    actions.setRepeatDays(dispatch, days);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await actions.createTask(dispatch, state, toast, () => {
      // Close dialog after successful creation
      onOpenChange(false);
      // You can add additional success handling here if needed
    });
  };

  const handleCancel = () => {
    actions.resetForm(dispatch);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          height: "90vh",
          overflowY: "auto",
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add New Task"
              : mode === "edit"
              ? "Edit Task"
              : "View Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="add-task-dialog-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Fields */}
            <TaskBasicFields
              title={title}
              description={description}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              validationErrors={validationErrors}
            />

            {/* Time Fields */}
            <TaskTimeFields
              startTime={startTime}
              endTime={endTime}
              duration={duration}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              validationErrors={validationErrors}
            />

            {/* Date Fields */}
            <TaskDateFields
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              validationErrors={validationErrors}
            />

            {/* Icon Selector */}
            <TaskIconSelector
              selectedIcon={icon}
              onIconSelect={handleIconChange}
              validationErrors={validationErrors}
            />

            {/* Repeat Fields */}
            <TaskRepeatFields
              repeatType={repeatType}
              repeatDays={repeatDays}
              onRepeatTypeChange={handleRepeatTypeChange}
              onRepeatDaysChange={handleRepeatDaysChange}
              validationErrors={validationErrors}
            />

            {/* Error Display */}
            {error && <div className="error-banner">{error}</div>}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              {mode !== "view" && (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner" />
                      {mode === "add" ? "Creating..." : "Updating..."}
                    </>
                  ) : mode === "add" ? (
                    "Create Task"
                  ) : (
                    "Update Task"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

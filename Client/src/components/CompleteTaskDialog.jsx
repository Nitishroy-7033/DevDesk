import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { taskAPI } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompleteTaskDialog = ({
  isOpen,
  onClose,
  task,
  executionDate,
  onTaskCompleted,
}) => {
  const [formData, setFormData] = useState({
    hoursSpent: "",
    completionNotes: "",
    qualityRating: "",
    difficultyLevel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const qualityOptions = [
    { value: "1", label: "Poor" },
    { value: "2", label: "Fair" },
    { value: "3", label: "Good" },
    { value: "4", label: "Very Good" },
    { value: "5", label: "Excellent" },
  ];

  const difficultyOptions = [
    { value: "1", label: "Very Easy" },
    { value: "2", label: "Easy" },
    { value: "3", label: "Medium" },
    { value: "4", label: "Hard" },
    { value: "5", label: "Very Hard" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hoursSpent || isNaN(parseFloat(formData.hoursSpent))) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of hours.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const completionData = {
        taskId: task.id,
        completionDate: new Date().toISOString(),
        notes: formData.completionNotes.trim(),
        completionType: "Manual",
      };

      const result = await taskAPI.completeTask(completionData);

      toast({
        title: "Task Completed",
        description: `Successfully completed "${task.title}".`,
      });

      // Reset form
      setFormData({
        hoursSpent: "",
        completionNotes: "",
        qualityRating: "",
        difficultyLevel: "",
      });

      // Notify parent component
      if (onTaskCompleted) {
        onTaskCompleted(result);
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Task</DialogTitle>
          <DialogDescription>
            Mark "{task?.title}" as completed and provide details about your
            work session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hoursSpent">Hours Spent *</Label>
            <Input
              id="hoursSpent"
              type="number"
              step="0.25"
              min="0"
              max="24"
              placeholder="e.g., 2.5"
              value={formData.hoursSpent}
              onChange={(e) => handleInputChange("hoursSpent", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualityRating">Quality Rating</Label>
            <Select
              value={formData.qualityRating}
              onValueChange={(value) =>
                handleInputChange("qualityRating", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate the quality of your work" />
              </SelectTrigger>
              <SelectContent>
                {qualityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficultyLevel">Difficulty Level</Label>
            <Select
              value={formData.difficultyLevel}
              onValueChange={(value) =>
                handleInputChange("difficultyLevel", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate the difficulty level" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completionNotes">Completion Notes</Label>
            <Textarea
              id="completionNotes"
              placeholder="What did you accomplish? Any insights or challenges?"
              value={formData.completionNotes}
              onChange={(e) =>
                handleInputChange("completionNotes", e.target.value)
              }
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Completing..." : "Complete Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteTaskDialog;

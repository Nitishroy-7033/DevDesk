import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { taskAPI } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const LogHoursDialog = ({ isOpen, onClose, task, executionDate }) => {
  const [formData, setFormData] = useState({
    hoursSpent: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      const logData = {
        taskId: task.id,
        executionDate: executionDate || new Date().toISOString().split('T')[0],
        hoursSpent: parseFloat(formData.hoursSpent),
        notes: formData.notes.trim(),
      };

      await taskAPI.logHours(logData);
      
      toast({
        title: "Hours Logged",
        description: `Successfully logged ${formData.hoursSpent} hours for "${task.title}".`,
      });

      // Reset form
      setFormData({
        hoursSpent: '',
        notes: '',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to log hours. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Hours</DialogTitle>
          <DialogDescription>
            Log the time spent working on "{task?.title}"
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
              onChange={(e) => handleInputChange('hoursSpent', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about your work session..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
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
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging..." : "Log Hours"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogHoursDialog;

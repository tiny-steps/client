import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timeoffService } from "../services/timeoffService.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Textarea } from "./ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Calendar } from "./ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx";
import { CalendarIcon, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils.js";

const TimeoffRequestForm = ({
  doctorId,
  onSuccess,
  onCancel,
  initialData = null,
}) => {
  // Helper function to format datetime for input
  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    // Format as yyyy-MM-ddThh:mm for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    description: "",
    startDatetime: "",
    endDatetime: "",
    recurrenceRule: "none",
    isAvailable: false,
    reason: "",
    emergencyContact: "",
    ...initialData,
    // Format initial data for input
    startDatetime: initialData?.startDatetime
      ? formatDateTimeForInput(initialData.startDatetime)
      : "",
    endDatetime: initialData?.endDatetime
      ? formatDateTimeForInput(initialData.endDatetime)
      : "",
  });

  const [conflicts, setConflicts] = useState([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const createTimeOffMutation = useMutation({
    mutationFn: (data) => timeoffService.createTimeOff(doctorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["timeoffs", doctorId]);
      queryClient.refetchQueries(["timeoffs", doctorId]);
      queryClient.invalidateQueries(["availability", doctorId]);
      queryClient.refetchQueries(["availability", doctorId]);
      onSuccess?.();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const updateTimeOffMutation = useMutation({
    mutationFn: ({ timeOffId, data }) =>
      timeoffService.updateTimeOff(doctorId, timeOffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["timeoffs", doctorId]);
      queryClient.refetchQueries(["timeoffs", doctorId]);
      queryClient.invalidateQueries(["availability", doctorId]);
      queryClient.refetchQueries(["availability", doctorId]);
      onSuccess?.();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const checkConflictsMutation = useMutation({
    mutationFn: (data) => timeoffService.checkConflicts(doctorId, data),
    onSuccess: (result) => {
      setConflicts(result.conflicts || []);
    },
    onError: (error) => {
      console.error("Failed to check conflicts:", error);
    },
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.startDatetime) {
      newErrors.startDatetime = "Start date and time is required";
    }

    if (!formData.endDatetime) {
      newErrors.endDatetime = "End date and time is required";
    }

    if (formData.startDatetime && formData.endDatetime) {
      const start = new Date(formData.startDatetime);
      const end = new Date(formData.endDatetime);

      if (start >= end) {
        newErrors.endDatetime = "End time must be after start time";
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Fix timezone issue by creating dates in local timezone
    const startDate = new Date(formData.startDatetime);
    const endDate = new Date(formData.endDatetime);

    // Ensure we're working with local time, not UTC
    const startDatetime = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    ).toISOString();
    const endDatetime = new Date(
      endDate.getTime() - endDate.getTimezoneOffset() * 60000
    ).toISOString();

    const submitData = {
      ...formData,
      startDatetime,
      endDatetime,
    };

    if (initialData) {
      updateTimeOffMutation.mutate({
        timeOffId: initialData.id,
        data: submitData,
      });
    } else {
      createTimeOffMutation.mutate(submitData);
    }
  };

  // Check for conflicts when dates change
  useEffect(() => {
    if (formData.startDatetime && formData.endDatetime) {
      setIsCheckingConflicts(true);
      checkConflictsMutation.mutate({
        startDatetime: formData.startDatetime,
        endDatetime: formData.endDatetime,
      });
      setTimeout(() => setIsCheckingConflicts(false), 1000);
    }
  }, [formData.startDatetime, formData.endDatetime]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isSubmitting =
    createTimeOffMutation.isPending || updateTimeOffMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {initialData ? "Edit Time Off" : "Request Time Off"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="e.g., Vacation, Medical leave, Personal time"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDatetime">Start Date & Time *</Label>
              <Input
                id="startDatetime"
                type="datetime-local"
                value={formData.startDatetime}
                onChange={(e) =>
                  handleInputChange("startDatetime", e.target.value)
                }
                className={errors.startDatetime ? "border-red-500" : ""}
              />
              {errors.startDatetime && (
                <p className="text-sm text-red-500">{errors.startDatetime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDatetime">End Date & Time *</Label>
              <Input
                id="endDatetime"
                type="datetime-local"
                value={formData.endDatetime}
                onChange={(e) =>
                  handleInputChange("endDatetime", e.target.value)
                }
                className={errors.endDatetime ? "border-red-500" : ""}
              />
              {errors.endDatetime && (
                <p className="text-sm text-red-500">{errors.endDatetime}</p>
              )}
            </div>
          </div>

          {/* Conflict Check */}
          {isCheckingConflicts && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Checking for conflicts...</span>
            </div>
          )}

          {conflicts.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Conflicts Detected</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {conflicts.map((conflict, index) => (
                  <li key={index}>
                    • {conflict.type}: {conflict.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Time Off *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Please provide a detailed reason for your time off request..."
              rows={3}
              className={errors.reason ? "border-red-500" : ""}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">
              Emergency Contact (Optional)
            </Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) =>
                handleInputChange("emergencyContact", e.target.value)
              }
              placeholder="Name and phone number of emergency contact"
            />
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <Label htmlFor="recurrenceRule">Recurrence (Optional)</Label>
            <Select
              value={formData.recurrenceRule}
              onValueChange={(value) =>
                handleInputChange("recurrenceRule", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No recurrence</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Availability Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) =>
                handleInputChange("isAvailable", e.target.checked)
              }
              className="rounded"
            />
            <Label htmlFor="isAvailable" className="text-sm">
              This is special availability (not time off)
            </Label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {initialData ? "Updating..." : "Submitting..."}
                </div>
              ) : initialData ? (
                "Update Time Off"
              ) : (
                "Submit Request"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TimeoffRequestForm;

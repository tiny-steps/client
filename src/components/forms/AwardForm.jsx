import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import {
  getActiveDoctors,
  getDoctorDisplayName,
} from "../../utils/doctorUtils.js";

// Award form schema
const AwardFormSchema = z.object({
  doctorId: z.string().uuid("Please select a doctor"),
  title: z
    .string()
    .min(1, "Award title is required")
    .max(255, "Title must be less than 255 characters"),
  awardedYear: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  summary: z
    .string()
    .max(500, "Summary must be less than 500 characters")
    .optional(),
});

const AwardForm = ({ award, doctors, onSubmit, onCancel }) => {
  const isEdit = !!award;

  // Filter to show only active doctors
  const activeDoctors = getActiveDoctors(doctors || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(AwardFormSchema),
    defaultValues: {
      doctorId: award?.doctorId || "",
      title: award?.title || "",
      awardedYear: award?.awardedYear || new Date().getFullYear(),
      summary: award?.summary || "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-50/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Award" : "Add New Award"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Doctor Selection */}
            <div>
              <Label htmlFor="doctorId">Doctor *</Label>
              <select
                id="doctorId"
                {...register("doctorId")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a doctor</option>
                {activeDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {getDoctorDisplayName(doctor)}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            {/* Award Title */}
            <div>
              <Label htmlFor="title">Award Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Best Cardiologist of the Year"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Awarded Year */}
            <div>
              <Label htmlFor="awardedYear">Awarded Year *</Label>
              <Input
                id="awardedYear"
                type="number"
                {...register("awardedYear", { valueAsNumber: true })}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.awardedYear && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.awardedYear.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div>
              <Label htmlFor="summary">Summary</Label>
              <textarea
                id="summary"
                {...register("summary")}
                placeholder="Brief description of the award and its significance"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
              {errors.summary && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.summary.message}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Award"
                  : "Create Award"}
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
    </div>
  );
};

export default AwardForm;

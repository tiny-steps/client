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

// Qualification form schema
const QualificationFormSchema = z.object({
  doctorId: z.string().uuid("Please select a doctor"),
  qualificationName: z
    .string()
    .min(1, "Qualification name is required")
    .max(100, "Qualification name must be less than 100 characters"),
  collegeName: z
    .string()
    .max(255, "College name must be less than 255 characters")
    .optional(),
  completionYear: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
});

const QualificationForm = ({ qualification, doctors, onSubmit, onCancel }) => {
  const isEdit = !!qualification;

  // Filter to show only active doctors
  const activeDoctors = getActiveDoctors(doctors || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(QualificationFormSchema),
    defaultValues: {
      doctorId: qualification?.doctorId || "",
      qualificationName: qualification?.qualificationName || "",
      collegeName: qualification?.collegeName || "",
      completionYear: qualification?.completionYear || new Date().getFullYear(),
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-50/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Qualification" : "Add New Qualification"}
          </CardTitle>
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

            {/* Qualification Name */}
            <div>
              <Label htmlFor="qualificationName">Qualification Name *</Label>
              <Input
                id="qualificationName"
                {...register("qualificationName")}
                placeholder="e.g., MD in Cardiology"
              />
              {errors.qualificationName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.qualificationName.message}
                </p>
              )}
            </div>

            {/* College Name */}
            <div>
              <Label htmlFor="collegeName">College/University</Label>
              <Input
                id="collegeName"
                {...register("collegeName")}
                placeholder="e.g., Harvard Medical School"
              />
              {errors.collegeName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.collegeName.message}
                </p>
              )}
            </div>

            {/* Completion Year */}
            <div>
              <Label htmlFor="completionYear">Completion Year *</Label>
              <Input
                id="completionYear"
                type="number"
                {...register("completionYear", { valueAsNumber: true })}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.completionYear && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.completionYear.message}
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
                  ? "Update Qualification"
                  : "Create Qualification"}
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

export default QualificationForm;

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";

// Specialization form schema
const SpecializationFormSchema = z.object({
  doctorId: z.string().uuid("Please select a doctor"),
  speciality: z
    .string()
    .min(1, "Speciality is required")
    .max(100, "Speciality must be less than 100 characters"),
  subspecialization: z
    .string()
    .max(100, "Subspecialization must be less than 100 characters")
    .optional(),
});

const SpecializationForm = ({
  specialization,
  doctors,
  onSubmit,
  onCancel,
}) => {
  const isEdit = !!specialization;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(SpecializationFormSchema),
    defaultValues: {
      doctorId: specialization?.doctorId || "",
      speciality: specialization?.speciality || "",
      subspecialization: specialization?.subspecialization || "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Specialization" : "Add New Specialization"}
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
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            {/* Speciality */}
            <div>
              <Label htmlFor="speciality">Speciality *</Label>
              <Input
                id="speciality"
                {...register("speciality")}
                placeholder="e.g., Cardiology"
              />
              {errors.speciality && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.speciality.message}
                </p>
              )}
            </div>

            {/* Subspecialization */}
            <div>
              <Label htmlFor="subspecialization">Subspecialization</Label>
              <Input
                id="subspecialization"
                {...register("subspecialization")}
                placeholder="e.g., Interventional Cardiology"
              />
              {errors.subspecialization && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.subspecialization.message}
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
                  ? "Update Specialization"
                  : "Create Specialization"}
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

export default SpecializationForm;

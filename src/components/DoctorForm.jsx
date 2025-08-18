import React from "react";
import { useForm } from "@tanstack/react-form";
import {
  CreateDoctorSchema,
  UpdateDoctorSchema,
} from "../schema/doctors/schema.js";
import { useCreateDoctor, useUpdateDoctor } from "../hooks/useDoctorQueries.js";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";

const DoctorForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEdit = false,
  isLoading = false,
}) => {
  const schema = isEdit ? UpdateDoctorSchema : CreateDoctorSchema;
  const createDoctorMutation = useCreateDoctor();
  const updateDoctorMutation = useUpdateDoctor();

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      password: initialData?.password || "",
      slug: initialData?.slug || "",
      gender: initialData?.gender || "MALE",
      summary: initialData?.summary || "",
      about: initialData?.about || "",
      imageUrl: initialData?.imageUrl || "",
      experienceYears: initialData?.experienceYears || 0,
      isVerified: initialData?.isVerified || false,
      ratingAverage: initialData?.ratingAverage || 0,
      reviewCount: initialData?.reviewCount || 0,
      status: initialData?.status || "ACTIVE",
    },
    onSubmit: async ({ value }) => {
      try {
        // Validate using Zod schema
        const validatedData = schema.parse(value);

        if (isEdit) {
          await updateDoctorMutation.mutateAsync({
            doctorId: initialData.id,
            doctorData: validatedData,
          });
        } else {
          await createDoctorMutation.mutateAsync(validatedData);
        }

        // Only call onSubmit after everything is done
        await onSubmit?.(validatedData);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (value) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    form.setFieldValue("slug", slug);
  };

  // Custom validation function
  const validateField = (name, value) => {
    try {
      const testData = { ...form.state.values, [name]: value };
      schema.parse(testData);
      return undefined;
    } catch (error) {
      const fieldError = error.issues?.find((issue) =>
        issue.path.includes(name)
      );
      return fieldError?.message || undefined;
    }
  };

  const isSubmitting =
    createDoctorMutation.isPending ||
    updateDoctorMutation.isPending ||
    isLoading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => validateField("name", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (!isEdit) handleNameChange(e.target.value);
                }}
                onBlur={field.handleBlur}
                placeholder="Enter doctor's full name"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email Field */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => validateField("email", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="doctor@example.com"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Phone Field */}
        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => validateField("phone", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="+1234567890"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Password Field - Only show for create mode */}
        {!isEdit && (
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => validateField("password", value),
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter password (min 8 characters)"
                  className={
                    field.state.meta.errors.length > 0 ? "border-red-500" : ""
                  }
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        )}

        {/* Slug Field */}
        <form.Field
          name="slug"
          validators={{
            onChange: ({ value }) => validateField("slug", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="doctor-slug"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Gender Field */}
        <form.Field
          name="gender"
          validators={{
            onChange: ({ value }) => validateField("gender", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Experience Years */}
        <form.Field
          name="experienceYears"
          validators={{
            onChange: ({ value }) => validateField("experienceYears", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="experienceYears">Experience (Years)</Label>
              <Input
                id="experienceYears"
                type="number"
                min="0"
                max="100"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value) || 0)
                }
                onBlur={field.handleBlur}
                placeholder="0"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Status Field */}
        <form.Field
          name="status"
          validators={{
            onChange: ({ value }) => validateField("status", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Verified Checkbox */}
        <form.Field
          name="isVerified"
          validators={{
            onChange: ({ value }) => validateField("isVerified", value),
          }}
        >
          {(field) => (
            <div className="flex items-center space-x-2">
              <input
                id="isVerified"
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="isVerified">Verified Doctor</Label>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Rating Average */}
        <form.Field
          name="ratingAverage"
          validators={{
            onChange: ({ value }) => validateField("ratingAverage", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="ratingAverage">Rating Average</Label>
              <Input
                id="ratingAverage"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(parseFloat(e.target.value) || 0)
                }
                onBlur={field.handleBlur}
                placeholder="0.0"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Review Count */}
        <form.Field
          name="reviewCount"
          validators={{
            onChange: ({ value }) => validateField("reviewCount", value),
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="reviewCount">Review Count</Label>
              <Input
                id="reviewCount"
                type="number"
                min="0"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value) || 0)
                }
                onBlur={field.handleBlur}
                placeholder="0"
                className={
                  field.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Image URL */}
      <form.Field
        name="imageUrl"
        validators={{
          onChange: ({ value }) => validateField("imageUrl", value),
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor="imageUrl">Profile Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="https://example.com/doctor-image.jpg"
              className={
                field.state.meta.errors.length > 0 ? "border-red-500" : ""
              }
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Summary */}
      <form.Field
        name="summary"
        validators={{
          onChange: ({ value }) => validateField("summary", value),
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor="summary">Summary</Label>
            <textarea
              id="summary"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Brief summary of doctor's expertise"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {field.state.value.length}/500 characters
            </p>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* About */}
      <form.Field
        name="about"
        validators={{
          onChange: ({ value }) => validateField("about", value),
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor="about">About</Label>
            <textarea
              id="about"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Detailed information about the doctor"
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {field.state.value.length}/2000 characters
            </p>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !form.state.canSubmit}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update Doctor"
          ) : (
            "Create Doctor"
          )}
        </Button>
      </div>
    </form>
  );
};

export default DoctorForm;

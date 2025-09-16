import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateSession,
  useUpdateSession,
  useGetSessionById,
} from "../../hooks/useSessionQueries.js";
import { useGetAllSessionTypes } from "../../hooks/useSessionQueries.js";
import { useGetAllDoctors } from "../../hooks/useDoctorQueries.js";
import useBranchStore from "../../store/useBranchStore.js";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.jsx";

const sessionSchema = z.object({
  doctorIds: z.array(z.string()).min(1, "At least one doctor is required"),
  sessionTypeId: z.string().min(1, "Session type is required"),
  price: z.number().min(0, "Price must be non-negative"),
  isActive: z.boolean().default(true),
  branchId: z.string().min(1, "Branch is required"), // Add branch validation
});

const SessionForm = ({ mode = "create" }) => {
  // Determine if we're in edit mode based on URL params
  const { id } = useParams();
  const isEditMode = mode === "edit" || !!id;
  const navigate = useNavigate();

  // Get branch information
  const branches = useBranchStore((state) => state.branches);
  const selectedBranchId = useBranchStore((state) => state.selectedBranchId);

  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      doctorIds: [],
      sessionTypeId: "",
      price: 0,
      isActive: true,
      branchId: selectedBranchId || "", // Set default to selected branch
    },
  });

  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const { data: existingSession, isLoading } = useGetSessionById(
    isEditMode ? id : null
  );
  const { data: sessionTypesData } = useGetAllSessionTypes({
    size: 100,
    branchId: form.watch("branchId") || selectedBranchId,
  });
  // Filter doctors by selected branch
  const { data: doctorsData } = useGetAllDoctors({
    size: 100,
    branchId: form.watch("branchId") || selectedBranchId,
  });

  // Load existing data for edit mode
  useEffect(() => {
    if (isEditMode && existingSession) {
      form.reset({
        doctorIds: existingSession.doctorId ? [existingSession.doctorId] : [],
        sessionTypeId: existingSession.sessionType?.id || "",
        price: existingSession.price || 0,
        isActive:
          existingSession.isActive !== undefined
            ? existingSession.isActive
            : true,
        branchId: existingSession.branchId || selectedBranchId || "",
      });
    } else if (!isEditMode) {
      // For create mode, set default branch
      form.setValue("branchId", selectedBranchId || "");
    }
  }, [existingSession, form, isEditMode, selectedBranchId]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        // For edit mode, convert back to single doctor format
        const sessionData = {
          ...data,
          doctorId: data.doctorIds[0], // Use the first selected doctor for edit
        };
        delete sessionData.doctorIds;
        await updateSession.mutateAsync({ id, sessionData });
      } else {
        // For create mode, create sessions for each selected doctor
        const sessionPromises = data.doctorIds.map((doctorId) => {
          const sessionData = {
            ...data,
            doctorId,
          };
          delete sessionData.doctorIds;
          console.log(
            "Creating session for doctor:",
            doctorId,
            "sessionData:",
            sessionData
          );
          return createSession.mutateAsync(sessionData);
        });
        await Promise.all(sessionPromises);
      }
      navigate("/sessions");
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ensure we have valid data structures
  const sessionTypes =
    sessionTypesData?.content || sessionTypesData?.data?.content || [];
  const doctors = doctorsData?.content || doctorsData?.data?.content || [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode
              ? "Edit Session Offering"
              : "Create New Session Offering"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Branch Selection */}
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch *</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          // Reset doctors when branch changes
                          form.setValue("doctorIds", []);
                        }}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select a branch...</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name} {branch.isPrimary ? "(Primary)" : ""}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doctorIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Doctors * (select multiple to create sessions for all
                      selected doctors)
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                        {doctors.length === 0 ? (
                          <p className="text-gray-500">
                            No doctors available for selected branch
                          </p>
                        ) : (
                          doctors.map((doctor) => (
                            <label
                              key={doctor.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  field.value?.includes(doctor.id) || false
                                }
                                onChange={(e) => {
                                  const currentValue = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentValue,
                                      doctor.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== doctor.id
                                      )
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">
                                {doctor.name}
                                {doctor.speciality
                                  ? ` - ${doctor.speciality}`
                                  : ""}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    {field.value && field.value.length > 0 && (
                      <p className="text-sm text-blue-600">
                        {field.value.length === 1
                          ? `1 session will be created`
                          : `${field.value.length} sessions will be created (one for each selected doctor)`}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Type *</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select a session type...</option>
                        {sessionTypes.map((sessionType) => (
                          <option key={sessionType.id} value={sessionType.id}>
                            {sessionType.name} (
                            {sessionType.defaultDurationMinutes} min)
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-gray-500">
                        Check if this session offering is currently available
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createSession.isPending || updateSession.isPending}
                  className="flex-1"
                >
                  {createSession.isPending || updateSession.isPending
                    ? "Saving..."
                    : isEditMode
                    ? "Update Session Offering"
                    : "Create Session Offering"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/sessions")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionForm;

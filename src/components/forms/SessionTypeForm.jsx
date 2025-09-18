import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateSessionType,
  useUpdateSessionType,
  useGetSessionTypeById,
} from "../../hooks/useSessionQueries.js";
import useBranchStore from "../../store/useBranchStore.js";
import useAddressStore from "../../store/useAddressStore.js";
import useUserStore from "../../store/useUserStore.js";
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

const sessionTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  defaultDurationMinutes: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration must be less than 8 hours"),
  isTelemedicineAvailable: z.boolean().default(false),
  isActive: z.boolean().default(true),
  branchId: z.string().min(1, "Branch is required"), // Add branch validation
});

const SessionTypeForm = ({ mode = "create", onSuccess, sessionTypeId }) => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const id = sessionTypeId || routeId;
  const isEditMode = mode === "edit" || !!id;

  // Get branch information
  const addresses = useAddressStore((state) => state.addresses);
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
  const userId = useUserStore((state) => state.userId);

  // Use addresses as branches since they represent the same data
  const branches = addresses;
  const selectedBranchId = selectedAddressId;

  // Fetch addresses if not already loaded
  useEffect(() => {
    if (userId && addresses.length === 0) {
      console.log(
        "🔍 SessionTypeForm - Fetching addresses for userId:",
        userId
      );
      fetchAddresses(userId).catch((error) => {
        console.warn("Failed to fetch addresses:", error.message);
      });
    }
  }, [userId, addresses.length, fetchAddresses]);

  const form = useForm({
    resolver: zodResolver(sessionTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultDurationMinutes: 30,
      isTelemedicineAvailable: false,
      isActive: true,
      branchId: selectedBranchId || "", // Set default to selected branch
    },
  });

  const createSessionType = useCreateSessionType();
  const updateSessionType = useUpdateSessionType();
  const { data: existingSessionType, isLoading } = useGetSessionTypeById(id);

  // Load existing data for edit mode
  useEffect(() => {
    if (mode === "edit" && existingSessionType) {
      form.reset({
        name: existingSessionType.name || "",
        description: existingSessionType.description || "",
        defaultDurationMinutes:
          existingSessionType.defaultDurationMinutes || 30,
        isTelemedicineAvailable:
          existingSessionType.isTelemedicineAvailable || false,
        isActive:
          existingSessionType.isActive !== undefined
            ? existingSessionType.isActive
            : true,
        branchId: existingSessionType.branchId || selectedBranchId || "",
      });
    } else if (!isEditMode) {
      // For create mode, set default branch
      form.setValue("branchId", selectedBranchId || "");
    }
  }, [existingSessionType, form, mode, selectedBranchId]);

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        await updateSessionType.mutateAsync({ id, sessionTypeData: data });
      } else {
        await createSessionType.mutateAsync(data);
      }

      // Call onSuccess callback if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/sessions");
      }
    } catch (error) {
      console.error("Failed to save session type:", error);
    }
  };

  if (mode === "edit" && isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {!onSuccess ? (
        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === "edit"
                  ? "Edit Session Type"
                  : "Create New Session Type"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                            onChange={field.onChange}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">Select a branch...</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}{" "}
                                {branch.isPrimary ? "(Primary)" : ""}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., General Consultation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brief description of the session type"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultDurationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Duration (minutes) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="480"
                            placeholder="30"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isTelemedicineAvailable"
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
                          <FormLabel>Available for Telemedicine</FormLabel>
                          <p className="text-sm text-gray-500">
                            Check if this session type can be conducted remotely
                          </p>
                        </div>
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
                            Check if this session type is currently available
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={
                        createSessionType.isPending ||
                        updateSessionType.isPending
                      }
                      className="flex-1"
                    >
                      {createSessionType.isPending ||
                      updateSessionType.isPending
                        ? "Saving..."
                        : mode === "edit"
                        ? "Update Session Type"
                        : "Create Session Type"}
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
      ) : (
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
                      onChange={field.onChange}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., General Consultation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the session type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultDurationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Duration (minutes) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="480"
                      placeholder="30"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTelemedicineAvailable"
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
                    <FormLabel>Available for Telemedicine</FormLabel>
                    <p className="text-sm text-gray-500">
                      Check if this session type can be conducted remotely
                    </p>
                  </div>
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
                      Check if this session type is currently available
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  createSessionType.isPending || updateSessionType.isPending
                }
                className="flex-1"
              >
                {createSessionType.isPending || updateSessionType.isPending
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Session Type"
                  : "Create Session Type"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default SessionTypeForm;

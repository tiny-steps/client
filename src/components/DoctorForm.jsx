import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateDoctor,
  useUpdateDoctor,
  useGetDoctorById,
  useGetUserAccessibleBranchIds,
} from "../hooks/useDoctorQueries.js";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Label } from "./ui/label.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import { CreateDoctorFormSchema } from "../schema/doctors/create.js";
import { UpdateDoctorFormSchema } from "../schema/doctors/update.js";
import useUserStore from "../store/useUserStore.js";
import useBranchStore from "../store/useBranchStore.js";
import useAddressStore from "../store/useAddressStore.js";

const DoctorForm = () => {
  const { doctorId } = useParams({});
  const navigate = useNavigate();
  const isEdit = !!doctorId;
  const [updateModal, setUpdateModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const { userId } = useUserStore();
  const branches = useBranchStore((state) => state.branches);
  const selectedBranchId = useBranchStore((state) => state.selectedBranchId);
  const setBranches = useBranchStore((state) => state.setBranches);
  const setSelectedBranchId = useBranchStore(
    (state) => state.setSelectedBranchId
  );

  // Address store for getting branch details
  const addresses = useAddressStore((state) => state.addresses);
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);

  // Get user's accessible branch IDs from API
  const { data: userAccessibleBranchesData, error: userBranchesError } =
    useGetUserAccessibleBranchIds(userId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: isEdit
      ? zodResolver(UpdateDoctorFormSchema)
      : zodResolver(CreateDoctorFormSchema),
    mode: "onBlur",
    defaultValues: isEdit
      ? {
          name: "",
          gender: "MALE",
          summary: "",
          about: "",
          imageUrl: "",
          experienceYears: 0,
          speciality: "",
          branchId: selectedBranchId || "",
          // No password field for edit mode
        }
      : {
          name: "",
          email: "",
          phone: "",
          gender: "MALE",
          summary: "",
          about: "",
          imageUrl: "",
          experienceYears: 0,
          speciality: "",
          password: "",
          branchId: selectedBranchId || "",
        },
  });

  // Debug logging
  console.log("DoctorForm rendered - isEdit:", isEdit, "doctorId:", doctorId);
  console.log("Form errors:", errors);
  console.log("Form isSubmitting:", isSubmitting);
  console.log(
    "Schema being used:",
    isEdit ? "UpdateDoctorFormSchema" : "CreateDoctorFormSchema"
  );
  // Extract branch IDs from API response
  const userAccessibleBranchIds = userAccessibleBranchesData?.data || [];

  // Debug logging
  console.log("🔍 Debug - DoctorForm branches:", branches);
  console.log("🔍 Debug - DoctorForm selectedBranchId:", selectedBranchId);
  console.log("🔍 Debug - DoctorForm branches.length:", branches?.length);
  console.log(
    "🔍 Debug - DoctorForm userAccessibleBranchesData:",
    userAccessibleBranchesData
  );
  console.log(
    "🔍 Debug - DoctorForm userAccessibleBranchIds:",
    userAccessibleBranchIds
  );
  console.log("🔍 Debug - DoctorForm userBranchesError:", userBranchesError);

  // Load branches from API if not already loaded
  useEffect(() => {
    if (branches.length === 0 && userAccessibleBranchIds.length > 0) {
      console.log("🔍 Debug - Loading branches from API data");

      // Filter addresses to only show those the user has access to
      const userAccessibleAddresses = addresses.filter((addr) =>
        userAccessibleBranchIds.includes(addr.id)
      );

      console.log(
        "🔍 Debug - userAccessibleAddresses:",
        userAccessibleAddresses
      );

      if (userAccessibleAddresses.length > 0) {
        setBranches(userAccessibleAddresses);
        // Set default selected branch to first available branch
        setSelectedBranchId(userAccessibleAddresses[0].id);
      }
    }
  }, [
    branches.length,
    userAccessibleBranchIds,
    addresses,
    setBranches,
    setSelectedBranchId,
  ]);

  // Fetch addresses if not already loaded
  useEffect(() => {
    if (userId && addresses.length === 0) {
      console.log("🔍 Debug - Fetching addresses for userId:", userId);
      fetchAddresses(userId).catch((error) => {
        console.warn("Failed to fetch addresses:", error.message);
      });
    }
  }, [userId, addresses.length, fetchAddresses]);

  // Fetch doctor data if editing
  const {
    data: doctorData,
    isLoading,
    error: fetchError,
  } = useGetDoctorById(doctorId, { enabled: isEdit });

  const createDoctorMutation = useCreateDoctor();
  const updateDoctorMutation = useUpdateDoctor();

  // Populate form when editing
  useEffect(() => {
    if (isEdit && doctorData && doctorData.data) {
      const doctor = doctorData.data;
      setValue("name", doctor.name || "");
      setValue("gender", doctor.gender || "MALE");
      setValue("summary", doctor.summary || "");
      setValue("about", doctor.about || "");
      setValue("imageUrl", doctor.imageUrl || "");
      setValue("experienceYears", doctor.experienceYears || 0);
      setValue("speciality", doctor.speciality || "");
      setValue("branchId", selectedBranchId || "");

      // Note: Email and phone are not stored in doctor entity, so we don't set them in edit mode
      // The doctor service will handle user updates internally
    }
  }, [doctorData, isEdit, setValue, selectedBranchId]);

  const onSubmit = async (data) => {
    console.log("🚀 onSubmit called - Form submitted with data:", data);
    console.log("🚀 isEdit:", isEdit, "errors:", errors);
    console.log(
      "🚀 Schema being used:",
      isEdit ? "UpdateDoctorFormSchema" : "CreateDoctorFormSchema"
    );
    console.log("🚀 Form data keys:", Object.keys(data));

    // Add userId to the data for backend
    const submitData = {
      ...data,
      userId: userId,
    };

    // Remove password field if empty (for updates)
    if (isEdit && !submitData.password) {
      delete submitData.password;
    }

    // Remove email and phone fields in edit mode since they're not part of doctor entity
    // In create mode, these fields are needed for user registration
    if (isEdit) {
      delete submitData.email;
      delete submitData.phone;
    }

    console.log("🚀 Submit data:", submitData);

    if (isEdit) {
      // Show confirmation modal for updates
      setFormData(submitData);
      setUpdateModal(true);
    } else {
      // Direct create for new doctors
      try {
        await createDoctorMutation.mutateAsync(submitData);
        navigate({ to: "/doctors" });
      } catch (error) {
        console.error("Failed to create doctor:", error);
      }
    }
  };

  const handleUpdateConfirm = async () => {
    console.log("Update confirmed with formData:", formData);
    console.log("Doctor ID:", doctorId);

    if (formData && doctorId) {
      try {
        console.log("Starting doctor update...");

        // Update doctor data
        await updateDoctorMutation.mutateAsync({
          id: doctorId,
          data: formData,
        });

        console.log("Doctor updated successfully");

        // User updates are now handled internally by the doctor service
        console.log(
          "Doctor updated successfully - user updates handled by doctor service"
        );

        // Navigate back to doctors list and trigger refresh
        navigate({ to: "/doctors" });
      } catch (error) {
        console.error("Failed to update doctor:", error);
      } finally {
        setUpdateModal(false);
      }
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading doctor data...</span>
      </div>
    );
  }

  if (isEdit && fetchError) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Doctor
          </h3>
          <p className="text-red-600 mb-4">{fetchError.message}</p>
          <Button
            onClick={() => navigate({ to: "/doctors" })}
            variant="outline"
          >
            Back to Doctors List
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Doctor" : "Add New Doctor"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Doctor's full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {!isEdit && (
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="doctor@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}

              {!isEdit && (
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

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

              <div>
                <Label htmlFor="experienceYears">Experience (Years) *</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  {...register("experienceYears", { valueAsNumber: true })}
                  placeholder="Years of experience"
                />
                {errors.experienceYears && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>

              {/* Branch Selection */}
              <div>
                <Label htmlFor="branchId">Branch *</Label>
                <select
                  id="branchId"
                  {...register("branchId")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedBranchId || ""}
                >
                  <option value="">
                    {branches.length === 0
                      ? userBranchesError
                        ? "Error loading branches - Check API connection"
                        : userAccessibleBranchIds.length === 0
                        ? "No accessible branches found"
                        : "Loading branches..."
                      : "Select a branch..."}
                  </option>
                  {branches.map((branch) => (
                    <option key={branch?.id} value={branch?.id}>
                      {branch?.name} {branch?.isPrimary ? "(Primary)" : ""}
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.branchId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {!isEdit && (
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Initial password"
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="summary">Summary</Label>
              <Input
                id="summary"
                {...register("summary")}
                placeholder="Brief summary"
              />
              {errors.summary && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.summary.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="about">About</Label>
              <textarea
                id="about"
                {...register("about")}
                placeholder="Detailed information about the doctor"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
              />
              {errors.about && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.about.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  createDoctorMutation.isPending ||
                  updateDoctorMutation.isPending
                }
                className="flex-1"
                onClick={() =>
                  console.log("Update button clicked - isEdit:", isEdit)
                }
              >
                {isSubmitting ||
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Doctor"
                  : "Create Doctor"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/doctors" })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Update Confirmation Modal */}
      <ConfirmModal
        open={updateModal}
        onOpenChange={setUpdateModal}
        title="Update Doctor"
        description={`Are you sure you want to update ${formData?.name}'s information? This will modify their profile data.`}
        confirmText="Update"
        cancelText="Cancel"
        variant="default"
        onConfirm={handleUpdateConfirm}
      />
    </div>
  );
};

export default DoctorForm;

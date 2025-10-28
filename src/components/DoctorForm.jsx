import React, { useEffect, useRef, useState } from "react";
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
import PhotoUploadModal from "./PhotoUploadModal.jsx";
import { Camera, X } from "lucide-react";
import { useToast } from "./ui/toast.jsx";
import CreatableSelect from "react-select/creatable";
import { doctorService } from "../services/doctorService.js";

const DoctorForm = () => {
  const { doctorId } = useParams({});
  const navigate = useNavigate();
  const isEdit = !!doctorId;
  const [updateModal, setUpdateModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const toast = useToast();

  // Specializations state (ID-based)
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [specializationsLoading, setSpecializationsLoading] = useState(false);
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
          remarks: "",
          about: "",
          imageUrl: "",
          experienceYears: 0,
          branchId: selectedBranchId || "",
          // No password field for edit mode
          // Note: specializations are managed separately via state
        }
      : {
          name: "",
          email: "",
          phone: "",
          gender: "MALE",
          remarks: "",
          about: "",
          imageUrl: "",
          experienceYears: 0,
          password: "",
          branchId: selectedBranchId || "",
          // Note: specializations are managed separately via state
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
      setValue("remarks", doctor.remarks || "");
      setValue("about", doctor.about || "");
      setValue("imageUrl", doctor.imageUrl || "");
      setValue("experienceYears", doctor.experienceYears || 0);
      setValue("branchId", selectedBranchId || "");
      // Note: specializations are fetched separately via useEffect

      // If doctor has an existing image, set it as the preview
      if (doctor.imageUrl) {
        console.log("📸 Loading existing doctor image:", doctor.imageUrl);
        setImagePreviewUrl(doctor.imageUrl);
        // Draw the existing image into the canvas
        setTimeout(() => {
          try {
            const img = new Image();
            // Don't set crossOrigin for same-origin images
            // img.crossOrigin = "anonymous";
            img.onload = () => {
              console.log("✅ Image loaded successfully for canvas");
              const canvas = canvasRef.current;
              if (!canvas) {
                console.warn("Canvas ref not available");
                return;
              }
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                console.warn("Canvas context not available");
                return;
              }
              const size = canvas.width;
              ctx.clearRect(0, 0, size, size);
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, size, size);
              const scale = Math.max(
                (size / img.width) * zoom,
                (size / img.height) * zoom
              );
              const drawWidth = img.width * scale;
              const drawHeight = img.height * scale;
              const dx = (size - drawWidth) / 2;
              const dy = (size - drawHeight) / 2;
              ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
              ctx.globalCompositeOperation = "destination-in";
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.fill();
              ctx.globalCompositeOperation = "source-over";
            };
            img.onerror = (e) => {
              console.error(
                "❌ Failed to load existing doctor image:",
                doctor.imageUrl,
                e
              );
              // If image fails to load, clear the preview
              setImagePreviewUrl(null);
            };
            img.src = doctor.imageUrl;
          } catch (err) {
            console.error("❌ Failed to render existing image preview:", err);
          }
        }, 0);
      }

      // Note: Email and phone are not stored in doctor entity, so we don't set them in edit mode
      // The doctor service will handle user updates internally
    }
  }, [doctorData, isEdit, setValue, selectedBranchId, zoom]);

  // Fetch all specializations (ID-based)
  useEffect(() => {
    const fetchAllSpecializations = async () => {
      try {
        setSpecializationsLoading(true);
        const response = await doctorService.getAllSpecializations();
        if (response && response.data) {
          // Convert to react-select format: [{value: "uuid", label: "Cardiology"}]
          const options = response.data.map((spec) => ({
            value: spec.id, // Use ID instead of name
            label: spec.name,
            description: spec.description, // Store for tooltip/info
          }));
          setAvailableSpecializations(options);
        }
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
        toast.error("Failed to load specializations");
      } finally {
        setSpecializationsLoading(false);
      }
    };

    fetchAllSpecializations();
  }, []); // Run only on component mount

  // Handler for creating new specialization
  const handleCreateSpecialization = async (inputValue) => {
    if (!inputValue || inputValue.trim() === "") {
      toast.error("Specialization name cannot be empty");
      return;
    }

    try {
      setSpecializationsLoading(true);
      const newSpec = await doctorService.createSpecialization({
        name: inputValue.trim(),
        description: `${inputValue.trim()} specialist`,
      });

      if (newSpec && newSpec.data) {
        const newOption = {
          value: newSpec.data.id,
          label: newSpec.data.name,
          description: newSpec.data.description,
        };

        // Add to available options
        setAvailableSpecializations((prev) => [...prev, newOption]);

        // Add to selected
        setSelectedSpecializations((prev) => [...prev, newOption]);

        toast.success(`Created specialization: ${newSpec.data.name}`);
        return newOption;
      }
    } catch (error) {
      console.error("Failed to create specialization:", error);
      toast.error(error.message || "Failed to create specialization");
    } finally {
      setSpecializationsLoading(false);
    }
  };

  // Fetch doctor's specializations in edit mode
  useEffect(() => {
    const fetchDoctorSpecializations = async () => {
      if (isEdit && doctorId && availableSpecializations.length > 0) {
        try {
          const response = await doctorService.getDoctorSpecializations(
            doctorId
          );
          if (response && response.data) {
            // Find matching specializations from available list by name
            // (until backend returns specializationId directly)
            const selectedOptions = response.data
              .map((spec) => {
                // Find the matching option in availableSpecializations by name
                const matchingOption = availableSpecializations.find(
                  (option) => option.label === spec.speciality
                );
                if (matchingOption) {
                  return {
                    ...matchingOption,
                    subspecialization: spec.subspecialization || null,
                  };
                }
                return null;
              })
              .filter(Boolean); // Remove null entries

            setSelectedSpecializations(selectedOptions);
          }
        } catch (error) {
          console.error("Failed to fetch doctor specializations:", error);
          // Don't show error toast here as it's not critical for form loading
        }
      }
    };

    fetchDoctorSpecializations();
  }, [isEdit, doctorId, availableSpecializations]);

  const onSubmit = async (data) => {
    console.log("🚀 onSubmit called - Form submitted with data:", data);
    console.log("🚀 isEdit:", isEdit, "errors:", errors);
    console.log(
      "🚀 Schema being used:",
      isEdit ? "UpdateDoctorFormSchema" : "CreateDoctorFormSchema"
    );
    console.log("🚀 Form data keys:", Object.keys(data));

    // If an image file is selected, attempt to upload it (if endpoint configured)
    if (selectedImageFile) {
      const uploadEndpoint = import.meta.env.VITE_UPLOAD_ENDPOINT;
      // Prepare cropped image from canvas if available
      let fileToUpload = selectedImageFile;
      try {
        if (canvasRef.current) {
          const blob = await new Promise((resolve) =>
            canvasRef.current.toBlob((b) => resolve(b), "image/jpeg", 0.92)
          );
          if (blob) {
            fileToUpload = new File(
              [blob],
              selectedImageFile.name || "avatar.jpg",
              {
                type: "image/jpeg",
              }
            );
          }
        }
      } catch (e) {
        console.warn(
          "Failed to prepare cropped image, falling back to original file."
        );
      }

      if (uploadEndpoint) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append("file", fileToUpload);
          const res = await fetch(uploadEndpoint, {
            method: "POST",
            body: formDataUpload,
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Image upload failed");
          }
          const uploadJson = await res.json();
          // Expecting { url: "https://..." }
          if (uploadJson?.url) {
            data.imageUrl = uploadJson.url;
          } else if (uploadJson?.data?.url) {
            data.imageUrl = uploadJson.data.url;
          } else {
            throw new Error("Upload response missing URL");
          }
        } catch (err) {
          console.error("Image upload error:", err);
          alert(
            "Image upload failed. Please try again later or contact support."
          );
          return;
        }
      } else {
        // No upload endpoint → embed base64 image for backend user-service to persist
        if (canvasRef.current) {
          try {
            const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.92);
            data.imageData = dataUrl; // backend to store and return a URL
          } catch (e) {
            console.warn("Failed generating data URL for image");
          }
        }
      }
    }

    // Add userId to the data for backend
    const submitData = {
      ...data,
      userId: userId,
    };

    // Add specializations array to submit data (ID-based)
    if (selectedSpecializations && selectedSpecializations.length > 0) {
      submitData.specializations = selectedSpecializations.map((spec) => ({
        specializationId: spec.value, // Send ID instead of name
        subspecialization: spec.subspecialization || null,
      }));
    } else {
      submitData.specializations = [];
    }

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
    console.log("🚀 Specializations:", submitData.specializations);

    if (isEdit) {
      // Show confirmation modal for updates
      setFormData(submitData);
      setUpdateModal(true);
    } else {
      // Direct create for new doctors
      try {
        await createDoctorMutation.mutateAsync(submitData);
        toast.success("Doctor created successfully!");
        navigate({ to: "/doctors" });
      } catch (error) {
        console.error("Failed to create doctor:", error);

        // Extract user-friendly error message
        let errorMessage = "Failed to create doctor. Please try again.";

        if (error.message) {
          // Check for common duplicate errors
          if (
            error.message.includes("email address already exists") ||
            (error.message.includes("email") &&
              error.message.includes("already exists"))
          ) {
            errorMessage =
              "A doctor with this email address already exists. Please use a different email.";
          } else if (
            error.message.includes("phone number already exists") ||
            (error.message.includes("phone") &&
              error.message.includes("already exists"))
          ) {
            errorMessage =
              "A doctor with this phone number already exists. Please use a different phone number.";
          } else if (error.message.includes("already exists")) {
            errorMessage =
              "A doctor with this information already exists. Please check your input.";
          } else {
            errorMessage = error.message;
          }
        }

        toast.error(errorMessage);
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

        toast.success("Doctor updated successfully!");

        // Navigate back to doctors list and trigger refresh
        navigate({ to: "/doctors" });
      } catch (error) {
        console.error("Failed to update doctor:", error);

        // Extract user-friendly error message
        let errorMessage = "Failed to update doctor. Please try again.";

        if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
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

  // Handle photo save from modal
  const handlePhotoSave = (file, url) => {
    console.log("📸 Photo saved from modal:", { file, url });
    setSelectedImageFile(file);
    setImagePreviewUrl(url);

    // Draw the cropped image to canvas for backward compatibility with existing upload logic
    setTimeout(() => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const size = canvas.width;
          ctx.clearRect(0, 0, size, size);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          console.log("✅ Image drawn to canvas successfully");
        };
        img.onerror = (e) => {
          console.error("❌ Failed to load image for canvas:", e);
        };
        img.src = url;
      } catch (err) {
        console.error("❌ Failed to render image to canvas:", err);
      }
    }, 0);
  };

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
                <Label htmlFor="specializations">Specializations</Label>
                <CreatableSelect
                  id="specializations"
                  isMulti
                  isClearable
                  isLoading={specializationsLoading}
                  isDisabled={isSubmitting}
                  options={availableSpecializations}
                  value={selectedSpecializations}
                  onChange={(selected) =>
                    setSelectedSpecializations(selected || [])
                  }
                  onCreateOption={handleCreateSpecialization}
                  placeholder="Select existing or type to create new..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "36px",
                      borderColor: errors.specializations
                        ? "#ef4444"
                        : base.borderColor,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#e0f2fe",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#0369a1",
                    }),
                  }}
                  formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                />
                {selectedSpecializations.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Select from existing specializations or type to
                    create new ones
                  </p>
                )}
                {errors.specializations && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.specializations.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="experienceYears">Experience (Years) *</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  step="1"
                  {...register("experienceYears", { valueAsNumber: true })}
                  placeholder="Years of experience (1-80)"
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

            {/* Profile Image Uploader */}
            <div className="space-y-3">
              <Label>Profile Photo *</Label>
              <div className="flex items-start gap-4">
                {/* Circular Preview */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Camera className="h-8 w-8 mb-1" />
                        <span className="text-xs">No photo</span>
                      </div>
                    )}
                  </div>
                  {imagePreviewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreviewUrl("");
                        setSelectedImageFile(null);
                      }}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Upload Button and Info */}
                <div className="flex-1 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPhotoModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {imagePreviewUrl ? "Change Photo" : "Choose Photo"}
                  </Button>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Upload a profile photo for the doctor.
                    </p>
                    <p className="text-xs text-gray-500">
                      You can drag and drop, zoom, and reposition the image.
                    </p>
                    <p className="text-xs text-gray-400">
                      Supported: JPG, PNG, GIF, WEBP (max 5MB)
                    </p>
                  </div>
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.imageUrl.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Hidden canvas for backward compatibility with upload logic */}
              <canvas
                ref={canvasRef}
                width={512}
                height={512}
                className="hidden"
              />
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
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                {...register("remarks")}
                placeholder="Brief remarks or notes"
              />
              {errors.remarks && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.remarks.message}
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

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        open={photoModalOpen}
        onOpenChange={setPhotoModalOpen}
        onSave={handlePhotoSave}
        initialImage={imagePreviewUrl || null}
        title="Upload Profile Photo"
      />
    </div>
  );
};

export default DoctorForm;

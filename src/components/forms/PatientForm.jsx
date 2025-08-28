import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetEnrichedPatientById,
  useCreateEnrichedPatient,
  useUpdateEnrichedPatient,
} from "../../hooks/useEnrichedPatientQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { ConfirmModal } from "../ui/confirm-modal.jsx";

const PatientForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" && id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    heightCm: "",
    weightKg: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: patientData, isLoading: isLoadingPatient } =
    useGetEnrichedPatientById(id, {
      enabled: isEdit,
    });

  const createPatient = useCreateEnrichedPatient();
  const updatePatient = useUpdateEnrichedPatient();

  useEffect(() => {
    if (isEdit && patientData?.data) {
      const patient = patientData.data;
      setFormData({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        dateOfBirth: patient.dateOfBirth
          ? patient.dateOfBirth.split("T")[0]
          : "",
        gender: patient.gender || "",
        bloodGroup: patient.bloodGroup || "",
        heightCm: patient.heightCm || "",
        weightKg: patient.weightKg || "",
      });
    }
  }, [isEdit, patientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!isEdit && !formData.password.trim())
      newErrors.password = "Password is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    // Password validation (only for new patients)
    if (!isEdit && formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        heightCm: formData.heightCm ? parseInt(formData.heightCm) : null,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
      };

      if (isEdit) {
        await updatePatient.mutateAsync({ id, data: submitData });
      } else {
        await createPatient.mutateAsync(submitData);
      }

      navigate("/patients");
    } catch (error) {
      console.error("Error saving patient:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (isEdit && isLoadingPatient) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Patient" : "Add New Patient"}
        </h1>
        <Button variant="outline" onClick={() => navigate("/patients")}>
          Back to Patients
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password *
                  </label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="Enter password (min 8 characters)"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth *
                </label>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Height (cm)
                  </label>
                  <Input
                    name="heightCm"
                    type="number"
                    step="0.1"
                    value={formData.heightCm}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Weight (kg)
                  </label>
                  <Input
                    name="weightKg"
                    type="number"
                    step="0.1"
                    value={formData.weightKg}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/patients")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createPatient.isPending || updatePatient.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createPatient.isPending || updatePatient.isPending
              ? "Saving..."
              : isEdit
              ? "Update Patient"
              : "Create Patient"}
          </Button>
        </div>
      </form>

      <ConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title={isEdit ? "Update Patient" : "Create Patient"}
        description={`Are you sure you want to ${
          isEdit ? "update" : "create"
        } this patient record?`}
        confirmText={isEdit ? "Update" : "Create"}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};

export default PatientForm;

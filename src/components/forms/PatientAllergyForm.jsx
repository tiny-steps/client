import React, { useState, useEffect } from "react";
import { useGetAllEnrichedPatients } from "../../hooks/useEnrichedPatientQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";

const PatientAllergyForm = ({ allergy, onSubmit, onCancel }) => {
  const isEdit = !!allergy;
  const [formData, setFormData] = useState({
    patientId: "",
    allergen: "",
    reaction: "",
    severity: "MILD",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const { data: patientsData } = useGetAllEnrichedPatients({ size: 1000 });

  useEffect(() => {
    if (isEdit && allergy) {
      setFormData({
        patientId: allergy.patientId || "",
        allergen: allergy.allergen || "",
        reaction: allergy.reaction || "",
        severity: allergy.severity || "MILD",
        notes: allergy.notes || "",
      });
    }
  }, [isEdit, allergy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = "Patient is required";
    }
    if (!formData.allergen.trim()) {
      newErrors.allergen = "Allergen is required";
    }
    if (!formData.reaction.trim()) {
      newErrors.reaction = "Reaction is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const patients = patientsData?.data?.content || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Allergy" : "Add New Allergy"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientId">Patient *</Label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.patientId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select a patient...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="allergen">Allergen *</Label>
            <Input
              id="allergen"
              name="allergen"
              value={formData.allergen}
              onChange={handleInputChange}
              placeholder="e.g., Penicillin, Peanuts, Shellfish"
              className={errors.allergen ? "border-red-500" : ""}
            />
            {errors.allergen && (
              <p className="text-red-500 text-xs mt-1">{errors.allergen}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reaction">Reaction *</Label>
            <Input
              id="reaction"
              name="reaction"
              value={formData.reaction}
              onChange={handleInputChange}
              placeholder="e.g., Rash, Swelling, Difficulty breathing"
              className={errors.reaction ? "border-red-500" : ""}
            />
            {errors.reaction && (
              <p className="text-red-500 text-xs mt-1">{errors.reaction}</p>
            )}
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="MILD">Mild</option>
              <option value="MODERATE">Moderate</option>
              <option value="SEVERE">Severe</option>
              <option value="LIFE_THREATENING">Life-threatening</option>
            </select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="Additional notes about the allergy..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEdit ? "Update Allergy" : "Add Allergy"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientAllergyForm;

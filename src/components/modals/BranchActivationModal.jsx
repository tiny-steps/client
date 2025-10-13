import React, { useState, useEffect } from "react";
import { Button } from "../ui/button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Modal } from "../ui/modal.jsx";
import { Checkbox } from "../ui/checkbox.jsx";
import { Building2 } from "lucide-react";
import { useGetDoctorBranches } from "../../hooks/useDoctorQueries.js";
import { useGetDoctorActiveBranches } from "../../hooks/useDoctorRobustSoftDelete.js";
import useAddressStore from "../../store/useAddressStore.js";

const BranchActivationModal = ({
  isOpen,
  onClose,
  doctor,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [reason, setReason] = useState("");
  const [practiceRole, setPracticeRole] = useState("CONSULTANT");

  // Get all available addresses for branch selection
  const addresses = useAddressStore((state) => state.addresses);

  // Get doctor's associated branches (all branches, not just active ones)
  const { data: doctorBranchesData, isLoading: branchesLoading } =
    useGetDoctorBranches(doctor?.id, { enabled: isOpen && !!doctor });

  // Get doctor's active branches to show status
  const { data: activeBranchesData } = useGetDoctorActiveBranches(doctor?.id, {
    enabled: isOpen && !!doctor,
  });

  const doctorBranchIds = doctorBranchesData?.branchIds || [];
  const activeBranches = activeBranchesData?.activeBranches || [];

  // Show all addresses, but mark which ones the doctor is already associated with
  const allAddresses = addresses;
  const doctorAssociatedAddresses = addresses.filter((address) =>
    doctorBranchIds.includes(address.id)
  );

  // Initialize selected branches when modal opens
  useEffect(() => {
    if (isOpen && doctor) {
      setSelectedBranchIds([]);
      setReason("");
      setPracticeRole("CONSULTANT");
    }
  }, [isOpen, doctor]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBranchIds([]);
      setReason("");
      setPracticeRole("CONSULTANT");
    }
  }, [isOpen]);

  const handleBranchToggle = (branchId) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleConfirm = () => {
    if (selectedBranchIds.length === 0) {
      return;
    }

    onConfirm({
      doctorId: doctor.id,
      branchIds: selectedBranchIds,
      reason: reason.trim() || null,
      practiceRole: practiceRole,
    });
  };

  const getAddressDisplayName = (address) => {
    if (!address) return "Unknown Address";
    return `${address.name || "Unnamed"} - ${address.city || "Unknown City"}`;
  };

  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Activate Doctor in Branches"
      size="lg"
    >
      <div className="space-y-6">
        {/* Doctor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <p className="text-sm text-gray-600">
              {doctor.specializations && doctor.specializations.length > 0
                ? doctor.specializations
                    .map((spec) => spec.speciality)
                    .join(", ")
                : "General"}
            </p>
            <p className="text-sm text-red-600 font-medium">
              Currently globally deactivated
            </p>
          </CardHeader>
        </Card>

        {/* Branch Selection */}
        {branchesLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Select Branches to Activate ({allAddresses.length} available)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {allAddresses.map((address) => {
                  const isCurrentlyActive = activeBranches.some(
                    (branch) => branch.id === address.id
                  );
                  const isAssociated = doctorBranchIds.includes(address.id);

                  return (
                    <div
                      key={address.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedBranchIds.includes(address.id)}
                          onChange={() => handleBranchToggle(address.id)}
                        />
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {getAddressDisplayName(address)}
                          </span>
                          {isCurrentlyActive && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Currently Active
                            </span>
                          )}
                          {!isAssociated && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              New Association
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {address.state}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedBranchIds.length === 0 && (
                <p className="text-sm text-amber-600 mt-3">
                  Please select at least one branch to activate the doctor in.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Practice Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Practice Role</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={practiceRole}
              onChange={(e) => setPracticeRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            >
              <option value="CONSULTANT">Consultant</option>
              <option value="VISITING_DOCTOR">Visiting Doctor</option>
              <option value="HEAD_OF_DEPARTMENT">Head of Department</option>
              <option value="RESIDENT">Resident</option>
              <option value="SPECIALIST">Specialist</option>
              <option value="EMERGENCY_DOCTOR">Emergency Doctor</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              This role will be assigned for new branch associations.
            </p>
          </CardContent>
        </Card>

        {/* Reason Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reason (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for reactivation..."
              className="w-full p-3 border rounded-md resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={isLoading || selectedBranchIds.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading
              ? "Activating..."
              : `Activate in ${selectedBranchIds.length} Branch${
                  selectedBranchIds.length > 1 ? "es" : ""
                }`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BranchActivationModal;

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.jsx";
import { Modal } from "../ui/modal.jsx";
import { Checkbox } from "../ui/checkbox.jsx";
import { Building2 } from "lucide-react";
import { useGetDoctorActiveBranches } from "../../hooks/useDoctorRobustSoftDelete.js";

const RobustDeleteModal = ({
  isOpen,
  onClose,
  doctor,
  currentBranchId,
  onConfirm,
  isLoading = false,
}) => {
  const [forceGlobalDeactivation, setForceGlobalDeactivation] = useState(false);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  // Get doctor's active branches
  const { data: activeBranchesData, isLoading: branchesLoading } =
    useGetDoctorActiveBranches(doctor?.id, { enabled: isOpen && !!doctor });

  const activeBranches = activeBranchesData?.activeBranches || [];
  const currentBranch = activeBranches.find(
    (branch) => branch.id === currentBranchId
  );

  // Initialize selected branches when modal opens
  useEffect(() => {
    if (isOpen && currentBranchId) {
      setSelectedBranchIds([currentBranchId]);
      setForceGlobalDeactivation(false);
    }
  }, [isOpen, currentBranchId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBranchIds([]);
      setForceGlobalDeactivation(false);
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
    onConfirm({
      doctorId: doctor.id,
      branchIds: selectedBranchIds,
      forceGlobalDeactivation,
    });
  };

  const canForceGlobal =
    activeBranches.length > 1 &&
    selectedBranchIds.length < activeBranches.length;

  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deactivate Doctor"
      size="lg"
    >
      <div className="space-y-6">
        {/* Doctor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <p className="text-sm text-gray-600">{doctor.speciality}</p>
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
                Active Branches ({activeBranches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedBranchIds.includes(branch.id)}
                        onChange={() => handleBranchToggle(branch.id)}
                        disabled={branch.id === currentBranchId} // Current branch is pre-selected
                      />
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{branch.name}</span>
                        {branch.id === currentBranchId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.city}, {branch.state}
                    </div>
                  </div>
                ))}
              </div>

              {/* Force Global Deactivation Option */}
              {canForceGlobal && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={forceGlobalDeactivation}
                      onChange={setForceGlobalDeactivation}
                    />
                    <div>
                      <label className="font-medium text-yellow-800">
                        Force Global Deactivation
                      </label>
                      <p className="text-sm text-yellow-700 mt-1">
                        This will deactivate the doctor globally even though
                        they have other active branches.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || selectedBranchIds.length === 0}
          >
            {isLoading
              ? "Deactivating..."
              : `Deactivate from ${selectedBranchIds.length} Branch${
                  selectedBranchIds.length > 1 ? "es" : ""
                }`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RobustDeleteModal;

import React, { useState, useEffect } from "react";
import {
  useGetDoctorBranches,
  useAddDoctorToBranch,
  useTransferDoctorBetweenBranches,
  useRemoveDoctorAddress,
  useActivateDoctorAddress,
  useGetUserAccessibleBranchIds,
} from "../../hooks/useDoctorQueries.js";
import useAddressStore from "../../store/useAddressStore.js";
import useUserStore from "../../store/useUserStore.js";
import { X, Plus, ArrowRightLeft, AlertCircle, Trash2, RotateCcw } from "lucide-react";

const BranchManagementModal = ({ isOpen, onClose, doctor }) => {
  const [activeTab, setActiveTab] = useState("add"); // "add" or "transfer"
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedSourceBranchId, setSelectedSourceBranchId] = useState("");
  const [selectedTargetBranchId, setSelectedTargetBranchId] = useState("");
  const [selectedRole, setSelectedRole] = useState("CONSULTANT");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addresses = useAddressStore((state) => state.addresses);
  const userId = useUserStore((state) => state.userId);
  const { data: doctorBranchesData, isLoading: branchesLoading } =
    useGetDoctorBranches(doctor?.id);
  const { data: userAccessibleBranchesData, error: userBranchesError } =
    useGetUserAccessibleBranchIds(userId);
  const addToBranchMutation = useAddDoctorToBranch();
  const transferMutation = useTransferDoctorBetweenBranches();
  const removeDoctorAddressMutation = useRemoveDoctorAddress();
  const activateDoctorAddressMutation = useActivateDoctorAddress();

  const doctorBranches = doctorBranchesData?.branchIds || [];
  const userAccessibleBranchIds = userAccessibleBranchesData?.data || [];

  // Debug logging
  console.log("Debug - BranchManagementModal:", {
    userId,
    addresses: addresses.map((addr) => ({ id: addr.id, name: addr.name })),
    userAccessibleBranchesData,
    userAccessibleBranchIds,
    userBranchesError,
    doctorBranches,
  });

  // Filter addresses to only show those the user has access to
  // If the API fails or returns empty data, fall back to all addresses
  const userAccessibleAddresses =
    userBranchesError || userAccessibleBranchIds.length === 0
      ? addresses
      : addresses.filter((addr) => userAccessibleBranchIds.includes(addr.id));

  const availableBranches = userAccessibleAddresses.filter(
    (addr) => !doctorBranches.includes(addr.id)
  );
  
  // Get current branches with status from the API response
  const currentBranches = doctorBranchesData?.currentAssignments?.map(assignment => {
    const address = addresses.find(addr => addr.id === assignment.branchId);
    return {
      ...address,
      status: assignment.status || 'ACTIVE', // Default to ACTIVE if no status
      role: assignment.role,
      isPrimary: assignment.isPrimary,
      assignedAt: assignment.assignedAt
    };
  }).filter(Boolean) || [];

  useEffect(() => {
    if (isOpen) {
      setActiveTab("add");
      setSelectedBranchId("");
      setSelectedSourceBranchId("");
      setSelectedTargetBranchId("");
      setSelectedRole("CONSULTANT");
      setError(null);
    }
  }, [isOpen, doctor]);

  const handleAddToBranch = async () => {
    if (!selectedBranchId) return;

    setIsLoading(true);
    setError(null);
    try {
      await addToBranchMutation.mutateAsync({
        doctorId: doctor.id,
        branchId: selectedBranchId,
        role: selectedRole,
      });
      onClose();
    } catch (error) {
      console.error("Error adding doctor to branch:", error);
      setError(
        error.message ||
          "Failed to add doctor to branch. Please check your access permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedSourceBranchId || !selectedTargetBranchId) return;

    setIsLoading(true);
    setError(null);
    try {
      await transferMutation.mutateAsync({
        doctorId: doctor.id,
        sourceBranchId: selectedSourceBranchId,
        targetBranchId: selectedTargetBranchId,
      });
      onClose();
    } catch (error) {
      console.error("Error transferring doctor:", error);
      setError(
        error.message ||
          "Failed to transfer doctor. Please check your access permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAddress = async (addressId, practiceRole = "CONSULTANT") => {
    setIsLoading(true);
    setError(null);
    try {
      await removeDoctorAddressMutation.mutateAsync({
        doctorId: doctor.id,
        addressId,
        practiceRole,
      });
      // Don't close modal - let user see the updated status
    } catch (error) {
      console.error("Error removing doctor from branch:", error);
      setError(
        error.message ||
          "Failed to remove doctor from branch. Please check your access permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateAddress = async (addressId, practiceRole = "CONSULTANT") => {
    setIsLoading(true);
    setError(null);
    try {
      await activateDoctorAddressMutation.mutateAsync({
        doctorId: doctor.id,
        addressId,
        practiceRole,
      });
      // Don't close modal - let user see the updated status
    } catch (error) {
      console.error("Error activating doctor address:", error);
      setError(
        error.message ||
          "Failed to activate doctor address. Please check your access permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const practiceRoles = [
    { value: "CONSULTANT", label: "Consultant" },
    { value: "VISITING_DOCTOR", label: "Visiting Doctor" },
    { value: "HEAD_OF_DEPARTMENT", label: "Head of Department" },
    { value: "RESIDENT", label: "Resident" },
    { value: "SPECIALIST", label: "Specialist" },
    { value: "EMERGENCY_DOCTOR", label: "Emergency Doctor" },
  ];

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Branches - {doctor.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Current Branches Display */}
        {currentBranches.length > 0 && (
          <div className="p-6 border-b bg-blue-50">
            <h3 className="text-sm font-medium text-blue-900 mb-3">
              Current Branches:
            </h3>
            <div className="space-y-2">
              {currentBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {branch.name || `${branch.type} - ${branch.city}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      Role: {branch.practiceRole || "CONSULTANT"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      branch.status === "ACTIVE" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {branch.status || "ACTIVE"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {branch.status === "INACTIVE" ? (
                      <button
                        onClick={() => handleActivateAddress(branch.id, branch.practiceRole)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                        title="Activate doctor at this branch"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveAddress(branch.id, branch.practiceRole)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Remove doctor from this branch"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "add"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add to Branch
          </button>
          {currentBranches.length > 0 && userAccessibleAddresses.length > 1 && (
            <button
              onClick={() => setActiveTab("transfer")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "transfer"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowRightLeft className="h-4 w-4 inline mr-2" />
              Transfer Between Branches
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-6 border-b bg-red-50">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Operation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* API Warning */}
        {userBranchesError && (
          <div className="p-6 border-b bg-yellow-50">
            <div className="flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Warning</p>
                <p className="text-sm">
                  Could not fetch your accessible branches. Showing all
                  branches. Some operations may fail due to access restrictions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {activeTab === "add" && (
            <div className="space-y-4">
              {availableBranches.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    This doctor is already assigned to all available branches.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Branch to Add
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a branch...</option>
                      {availableBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name || `${branch.type} - ${branch.city}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Practice Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {practiceRoles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToBranch}
                      disabled={!selectedBranchId || isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      {isLoading ? "Adding..." : "Add to Branch"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "transfer" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Branch
                </label>
                <select
                  value={selectedSourceBranchId}
                  onChange={(e) => setSelectedSourceBranchId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose source branch...</option>
                  {currentBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name || `${branch.type} - ${branch.city}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Branch
                </label>
                <select
                  value={selectedTargetBranchId}
                  onChange={(e) => setSelectedTargetBranchId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose target branch...</option>
                  {userAccessibleAddresses
                    .filter((branch) => branch.id !== selectedSourceBranchId)
                    .map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name || `${branch.type} - ${branch.city}`}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Transfer Warning</p>
                    <p>
                      This will move the doctor from the source branch to the
                      target branch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={
                    !selectedSourceBranchId ||
                    !selectedTargetBranchId ||
                    isLoading
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  {isLoading ? "Transferring..." : "Transfer Doctor"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchManagementModal;

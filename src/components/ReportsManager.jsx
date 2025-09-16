import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  useGetAllReports,
  useSearchReports,
  useGenerateReport,
  useDeleteReport,
} from "../hooks/useReportQueries.js";
import { reportService } from "../services/reportService.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";
import useAddressStore from "../store/useAddressStore.js";
import useUserStore from "../store/useUserStore.js"; // Import user store to get logged-in user ID

const ReportsManager = () => {
  const [searchFilters, setSearchFilters] = useState({
    startDate: "",
    endDate: "",
    reportType: "",
    branchId: "",
    userId: "",
  });
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, report: null });
  const [reportForm, setReportForm] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    branchId: "",
    statuses: [],
    format: "EXCEL", // Default to PDF format
  });

  // Get addresses for branch selection
  const { addresses } = useAddressStore();
  
  // Get logged-in user ID from user store
  const userId = useUserStore((state) => state.userId);

  // Use search API instead of getAllReports - the backend now handles all filtering logic
  const { data: reportsData, isLoading, refetch } = useSearchReports(searchFilters);

  const generateReport = useGenerateReport(() => {
    setShowGenerateModal(false);
    refetch(); // Refresh the reports list after generation
  });
  const deleteReport = useDeleteReport();

  const generateReportManually = useMutation({
    mutationFn: async (reportId) => {
      // For now, just refetch to check if the status has changed
      // The backend should handle generation automatically via Kafka
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay
      return { message: "Checking report status..." };
    },
    onSuccess: () => {
      refetch();
    },
  });

  const reports = reportsData || []; // Backend now returns array directly, not wrapped in data property

  const reportTypes = [
    { value: "APPOINTMENT_SUMMARY", label: "Appointment Summary" },
    { value: "DOCTOR_SCHEDULE", label: "Doctor Schedule" },
    { value: "PATIENT_HISTORY", label: "Patient History" },
  ];

  const appointmentStatuses = [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "CHECKED_IN", label: "Checked In" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      COMPLETED: "bg-green-100 text-green-800",
      PROCESSING: "bg-yellow-100 text-yellow-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button
          onClick={() => setShowGenerateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              className="px-3 py-2 border rounded-md"
              value={searchFilters.reportType}
              onChange={(e) => setSearchFilters({ ...searchFilters, reportType: e.target.value })}
            >
              <option value="">All Types</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Input
              type="date"
              placeholder="Start Date"
              value={searchFilters.startDate}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, startDate: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="End Date"
              value={searchFilters.endDate}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, endDate: e.target.value })
              }
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={searchFilters.branchId}
              onChange={(e) => setSearchFilters({ ...searchFilters, branchId: e.target.value })}
            >
              <option value="">All Branches</option>
              <option value="all">All Branches (Explicit)</option>
              {addresses?.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.branchName || `Branch ${address.id}`}
                </option>
              ))}
            </select>
            <Input
               type="text"
               placeholder="User ID"
               value={searchFilters.userId}
               onChange={(e) =>
                 setSearchFilters({ ...searchFilters, userId: e.target.value })
               }
             />
             <Button onClick={() => refetch()}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {report.reportType}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Generated: {new Date(report.generatedAt).toLocaleString()}
                  </p>
                  {report.branchId && (
                    <p className="text-xs text-blue-600 mt-1">
                      Branch: {report.branchId === 'all' ? 'All Branches' : report.branchId}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {report.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => generateReportManually.mutate(report.id)}
                      disabled={generateReportManually.isPending}
                    >
                      {generateReportManually.isPending
                        ? "Checking..."
                        : "Check Status"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reportService.downloadReport(report.id)}
                    disabled={report.status !== "COMPLETED"}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteModal({ open: true, report })}
                    disabled={deleteReport.isPending}
                  >
                    {deleteReport.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            No reports found. Generate your first report to get started.
          </p>
        </Card>
      )}

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-md border border-white/30">
            <CardHeader>
              <CardTitle className="text-gray-900">Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  generateReport.mutate({
                    reportType: reportForm.type,
                    title: reportForm.name,
                    startDate: reportForm.startDate,
                    endDate: reportForm.endDate,
                    branchId: reportForm.branchId || null,
                    statuses: reportForm.statuses,
                    format: reportForm.format, // Include format in the request
                    userId: userId, // Include logged-in user ID
                  });
                }}
                className="space-y-4"
              >
                <Input
                  name="name"
                  placeholder="Report Name"
                  value={reportForm.name}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, name: e.target.value })
                  }
                  required
                />

                <select
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={reportForm.type}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select Type...</option>
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <Input
                  name="startDate"
                  type="date"
                  value={reportForm.startDate}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, startDate: e.target.value })
                  }
                  required
                />

                <Input
                  name="endDate"
                  type="date"
                  value={reportForm.endDate}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, endDate: e.target.value })
                  }
                  required
                />

                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch (Leave empty for all branches)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={reportForm.branchId}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, branchId: e.target.value })
                    }
                  >
                    <option value="">All Branches</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.name || `${address.street}, ${address.city}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Format
                  </label>
                  <select
                    name="format"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={reportForm.format}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, format: e.target.value })
                    }
                    required
                  >
                    <option value="PDF">PDF</option>
                    <option value="EXCEL">Excel</option>
                  </select>
                </div>

                {/* Status Selection - Only show for appointment summary reports */}
                {reportForm.type === "APPOINTMENT_SUMMARY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Statuses (Leave empty for all statuses)
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {appointmentStatuses.map((status) => (
                        <label
                          key={status.value}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={reportForm.statuses.includes(status.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReportForm({
                                  ...reportForm,
                                  statuses: [
                                    ...reportForm.statuses,
                                    status.value,
                                  ],
                                });
                              } else {
                                setReportForm({
                                  ...reportForm,
                                  statuses: reportForm.statuses.filter(
                                    (s) => s !== status.value
                                  ),
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={generateReport.isPending}>
                    {generateReport.isPending ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowGenerateModal(false);
                      setReportForm({
                        name: "",
                        type: "",
                        startDate: "",
                        endDate: "",
                        branchId: "",
                        statuses: [],
                        format: "PDF", // Reset format to default
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, report: null })}
        title="Delete Report"
        description={`Are you sure you want to delete "${deleteModal.report?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteModal.report) {
            deleteReport.mutate(deleteModal.report.id);
          }
        }}
      />
    </div>
  );
};

export default ReportsManager;

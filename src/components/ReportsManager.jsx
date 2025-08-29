import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  useGetAllReports,
  useGenerateReport,
  useDeleteReport,
} from "../hooks/useReportQueries.js";
import { reportService } from "../services/reportService.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";

const ReportsManager = () => {
  const [filters, setFilters] = useState({});
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, report: null });

  const { data: reportsData, isLoading, refetch } = useGetAllReports(filters);

  const generateReport = useGenerateReport(() => {
    setShowGenerateModal(false);
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

  const reports = reportsData?.data || [];

  const reportTypes = [
    { value: "APPOINTMENT_SUMMARY", label: "Appointment Summary" },
    { value: "CONSULTATION_HISTORY", label: "Session/Consultation History" },
    { value: "DOCTOR_PERFORMANCE", label: "Doctor Performance" },
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
    <div className="p-6 space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="px-3 py-2 border rounded-md"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
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
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="End Date"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
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
                    Generated: {new Date(report.createdAt).toLocaleString()}
                  </p>
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
                  const formData = new FormData(e.target);
                  generateReport.mutate({
                    reportType: formData.get("type"),
                    title: formData.get("name"),
                    startDate: formData.get("startDate"),
                    endDate: formData.get("endDate"),
                  });
                }}
                className="space-y-4"
              >
                <Input name="name" placeholder="Report Name" required />
                <select
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type...</option>
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <Input name="startDate" type="date" required />
                <Input name="endDate" type="date" required />
                <div className="flex gap-2">
                  <Button type="submit" disabled={generateReport.isPending}>
                    {generateReport.isPending ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGenerateModal(false)}
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

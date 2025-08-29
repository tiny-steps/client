// API service for report-related operations

class ReportService {
  async getAllReports(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.append("type", params.type);
    if (params.status) searchParams.append("status", params.status);
    if (params.generatedByUserId)
      searchParams.append("generatedByUserId", params.generatedByUserId);

    const response = await fetch(`/api/v1/reports?${searchParams}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch reports");
    const result = await response.json();
    return result; // Backend returns ResponseModel<List<ReportDto>>
  }

  async generateReport(reportData) {
    const response = await fetch(`/api/v1/reports`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate report");
    }
    const result = await response.json();
    return result; // Backend returns ResponseModel<ReportDto>
  }

  async getReportById(id) {
    const response = await fetch(`/api/v1/reports/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch report");
    const result = await response.json();
    return result; // Backend returns ResponseModel<ReportDto>
  }

  // Note: Delete endpoint doesn't exist in backend
  async deleteReport(id) {
    const response = await fetch(`/api/v1/reports/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete report");
    }
    return response.ok;
  }

  async generateReportManually(reportId) {
    // This is a placeholder function since the backend endpoint needs to be deployed
    // For now, we'll just return a success message
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { message: "Status check completed" };
  }

  async downloadReport(reportId) {
    const response = await fetch(`/api/v1/reports/${reportId}/download`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to download report");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Get filename from response headers or use default
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `report-${reportId}.xlsx`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const reportService = new ReportService();

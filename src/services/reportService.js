// API service for report-related operations

class ReportService {
  async getAllReports(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    if (params.type) searchParams.append('type', params.type);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const response = await fetch(`/api/reports?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  }

  async generateReport(reportData) {
    const response = await fetch(`/api/reports/generate`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate report');
    }
    return response.json();
  }

  async downloadReport(reportId) {
    const response = await fetch(`/api/reports/${reportId}/download`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to download report');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${reportId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getReportById(id) {
    const response = await fetch(`/api/reports/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  }

  async deleteReport(id) {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete report');
    }
    return response.ok;
  }
}

export const reportService = new ReportService();
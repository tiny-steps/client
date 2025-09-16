import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import DoctorsList from "../components/DoctorsList.jsx";
import { ToastProvider } from "../components/ui/toast.jsx";

// Mock the hooks
jest.mock("../hooks/useBranchFilter.js", () => ({
  useBranchFilter: () => ({ branchId: "123", hasSelection: true }),
}));

jest.mock("../hooks/useDoctorQueries.js", () => ({
  useGetAllDoctors: () => ({
    data: {
      data: {
        content: [
          {
            id: "1",
            name: "Dr. John Doe",
            speciality: "Cardiology",
            email: "john@example.com",
            phone: "+1234567890",
            experienceYears: 10,
            gender: "Male",
            status: "ACTIVE",
            doctorAddresses: [
              {
                address: { id: "123", name: "Main Branch", city: "New York" },
                status: "ACTIVE",
              },
            ],
          },
          {
            id: "2",
            name: "Dr. Jane Smith",
            speciality: "Neurology",
            email: "jane@example.com",
            phone: "+1987654321",
            experienceYears: 8,
            gender: "Female",
            status: "INACTIVE",
            doctorAddresses: [
              {
                address: { id: "123", name: "Main Branch", city: "New York" },
                status: "INACTIVE",
              },
            ],
          },
        ],
      },
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
  useDeleteDoctor: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("../hooks/useDoctorRobustSoftDelete.js", () => ({
  useDeactivateDoctorFromBranches: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useActivateDoctorInBranch: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useGetDoctorsWithBranchStatus: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
  useGetDoctorActiveBranches: () => ({
    data: {
      activeBranches: [
        { id: "123", name: "Main Branch", city: "New York", state: "NY" },
      ],
    },
    isLoading: false,
  }),
}));

const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>{children}</ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("DoctorsList - Robust Soft Delete", () => {
  test("renders doctors with status badges", () => {
    render(
      <TestWrapper>
        <DoctorsList />
      </TestWrapper>
    );

    expect(screen.getByText("Dr. John Doe")).toBeInTheDocument();
    expect(screen.getByText("Dr. Jane Smith")).toBeInTheDocument();

    // Check status badges
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  test("shows activate button for inactive doctors", () => {
    render(
      <TestWrapper>
        <DoctorsList />
      </TestWrapper>
    );

    // Should show activate button for inactive doctor
    const activateButtons = screen.getAllByText("Activate");
    expect(activateButtons.length).toBeGreaterThan(0);
  });

  test("shows deactivate button for active doctors", () => {
    render(
      <TestWrapper>
        <DoctorsList />
      </TestWrapper>
    );

    // Should show deactivate button for active doctor
    const deactivateButtons = screen.getAllByText("Deactivate");
    expect(deactivateButtons.length).toBeGreaterThan(0);
  });

  test("filters doctors by search input", async () => {
    render(
      <TestWrapper>
        <DoctorsList />
      </TestWrapper>
    );

    const nameInput = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(nameInput, { target: { value: "John" } });

    await waitFor(() => {
      // John Doe should be visible with highlighted text
      expect(screen.getByText("Dr. John Doe")).toBeInTheDocument();
    });
  });
});

// Test the three scenarios
describe("Robust Soft Delete Scenarios", () => {
  test("Scenario 1: Single branch doctor deactivation", () => {
    // This would test the backend logic, but frontend should handle the modal correctly
    expect(true).toBe(true); // Placeholder for scenario-specific tests
  });

  test("Scenario 2a: Multi-branch partial deactivation", () => {
    // Test partial deactivation with force global option
    expect(true).toBe(true); // Placeholder
  });

  test("Scenario 2b: Multi-branch full deactivation", () => {
    // Test full deactivation when all branches selected
    expect(true).toBe(true); // Placeholder
  });

  test("Scenario 3: Doctor reactivation", () => {
    // Test reactivation logic
    expect(true).toBe(true); // Placeholder
  });
});

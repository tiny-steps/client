import { Store, useStore } from "@tanstack/react-store";

// Initial state for the doctor store
const initialState = {
  // UI State
  selectedDoctorId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isLoading: false,
  error: null,

  // Filters and search
  searchQuery: "",
  filters: {
    status: "all",
    gender: "all",
    isVerified: "all",
    minRating: 0,
    speciality: "",
  },

  // Pagination
  pagination: {
    page: 0,
    size: 10,
    sort: "name,asc",
  },

  // Current doctor being edited
  currentDoctor: null,

  // Form state
  formData: {
    name: "",
    slug: "",
    gender: "MALE",
    summary: "",
    about: "",
    imageUrl: "",
    experienceYears: 0,
    isVerified: false,
    status: "ACTIVE",
  },

  // Validation errors
  validationErrors: {},

  // View mode
  viewMode: "list", // 'list', 'grid', 'table'
};

// Create the store
export const doctorStore = new Store(initialState);

// Actions for the doctor store
export const doctorActions = {
  // UI Actions
  setSelectedDoctorId: (doctorId) => {
    doctorStore.setState((state) => ({
      ...state,
      selectedDoctorId: doctorId,
    }));
  },

  openCreateModal: () => {
    doctorStore.setState((state) => ({
      ...state,
      isCreateModalOpen: true,
      currentDoctor: null,
      formData: { ...initialState.formData },
      validationErrors: {},
    }));
  },

  closeCreateModal: () => {
    doctorStore.setState((state) => ({
      ...state,
      isCreateModalOpen: false,
      currentDoctor: null,
      formData: { ...initialState.formData },
      validationErrors: {},
    }));
  },

  openEditModal: (doctor) => {
    doctorStore.setState((state) => ({
      ...state,
      isEditModalOpen: true,
      currentDoctor: doctor,
      formData: {
        name: doctor.name || "",
        slug: doctor.slug || "",
        gender: doctor.gender || "MALE",
        summary: doctor.summary || "",
        about: doctor.about || "",
        imageUrl: doctor.imageUrl || "",
        experienceYears: doctor.experienceYears || 0,
        isVerified: doctor.isVerified || false,
        status: doctor.status || "ACTIVE",
      },
      validationErrors: {},
    }));
  },

  closeEditModal: () => {
    doctorStore.setState((state) => ({
      ...state,
      isEditModalOpen: false,
      currentDoctor: null,
      formData: { ...initialState.formData },
      validationErrors: {},
    }));
  },

  openDeleteModal: (doctorId) => {
    doctorStore.setState((state) => ({
      ...state,
      isDeleteModalOpen: true,
      selectedDoctorId: doctorId,
    }));
  },

  closeDeleteModal: () => {
    doctorStore.setState((state) => ({
      ...state,
      isDeleteModalOpen: false,
      selectedDoctorId: null,
    }));
  },

  setLoading: (isLoading) => {
    doctorStore.setState((state) => ({
      ...state,
      isLoading,
    }));
  },

  setError: (error) => {
    doctorStore.setState((state) => ({
      ...state,
      error,
      isLoading: false,
    }));
  },

  clearError: () => {
    doctorStore.setState((state) => ({
      ...state,
      error: null,
    }));
  },

  // Search and Filter Actions
  setSearchQuery: (query) => {
    doctorStore.setState((state) => ({
      ...state,
      searchQuery: query,
      pagination: {
        ...state.pagination,
        page: 0, // Reset to first page when searching
      },
    }));
  },

  setFilter: (filterKey, value) => {
    doctorStore.setState((state) => ({
      ...state,
      filters: {
        ...state.filters,
        [filterKey]: value,
      },
      pagination: {
        ...state.pagination,
        page: 0, // Reset to first page when filtering
      },
    }));
  },

  setFilters: (newFilters) => {
    doctorStore.setState((state) => ({
      ...state,
      filters: {
        ...state.filters,
        ...newFilters,
      },
      pagination: {
        ...state.pagination,
        page: 0, // Reset to first page when filtering
      },
    }));
  },

  clearFilters: () => {
    doctorStore.setState((state) => ({
      ...state,
      filters: { ...initialState.filters },
      searchQuery: "",
      pagination: {
        ...state.pagination,
        page: 0,
      },
    }));
  },

  // Pagination Actions
  setPagination: (pagination) => {
    doctorStore.setState((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    }));
  },

  setPage: (page) => {
    doctorStore.setState((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        page,
      },
    }));
  },

  setPageSize: (size) => {
    doctorStore.setState((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        size,
        page: 0, // Reset to first page when changing page size
      },
    }));
  },

  setSort: (sort) => {
    doctorStore.setState((state) => ({
      ...state,
      pagination: {
        ...state.pagination,
        sort,
        page: 0, // Reset to first page when changing sort
      },
    }));
  },

  // Form Actions
  setFormData: (data) => {
    doctorStore.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        ...data,
      },
    }));
  },

  setFormField: (field, value) => {
    doctorStore.setState((state) => ({
      ...state,
      formData: {
        ...state.formData,
        [field]: value,
      },
      validationErrors: {
        ...state.validationErrors,
        [field]: undefined, // Clear field error when user starts typing
      },
    }));
  },

  setValidationErrors: (errors) => {
    doctorStore.setState((state) => ({
      ...state,
      validationErrors: errors,
    }));
  },

  clearValidationErrors: () => {
    doctorStore.setState((state) => ({
      ...state,
      validationErrors: {},
    }));
  },

  resetForm: () => {
    doctorStore.setState((state) => ({
      ...state,
      formData: { ...initialState.formData },
      validationErrors: {},
    }));
  },

  // View Mode Actions
  setViewMode: (mode) => {
    doctorStore.setState((state) => ({
      ...state,
      viewMode: mode,
    }));
  },

  // Complex Actions
  handleCreateSuccess: () => {
    doctorStore.setState((state) => ({
      ...state,
      isCreateModalOpen: false,
      formData: { ...initialState.formData },
      validationErrors: {},
      isLoading: false,
      error: null,
    }));
  },

  handleEditSuccess: () => {
    doctorStore.setState((state) => ({
      ...state,
      isEditModalOpen: false,
      currentDoctor: null,
      formData: { ...initialState.formData },
      validationErrors: {},
      isLoading: false,
      error: null,
    }));
  },

  handleDeleteSuccess: () => {
    doctorStore.setState((state) => ({
      ...state,
      isDeleteModalOpen: false,
      selectedDoctorId: null,
      isLoading: false,
      error: null,
    }));
  },

  // Get computed search params for API calls
  getSearchParams: () => {
    const state = doctorStore.state;
    const params = {
      page: state.pagination.page,
      size: state.pagination.size,
      sort: state.pagination.sort,
    };

    // Add search query if present
    if (state.searchQuery.trim()) {
      params.name = state.searchQuery.trim();
    }

    // Add filters if not default values
    if (state.filters.status !== "all") {
      params.status = state.filters.status;
    }
    if (state.filters.gender !== "all") {
      params.gender = state.filters.gender;
    }
    if (state.filters.isVerified !== "all") {
      params.isVerified = state.filters.isVerified === "true";
    }
    if (state.filters.minRating > 0) {
      params.minRating = state.filters.minRating;
    }
    if (state.filters.speciality.trim()) {
      params.speciality = state.filters.speciality.trim();
    }

    return params;
  },
};

// Selectors for common state combinations
export const doctorSelectors = {
  getUIState: () => {
    const state = doctorStore.state;
    return {
      selectedDoctorId: state.selectedDoctorId,
      isCreateModalOpen: state.isCreateModalOpen,
      isEditModalOpen: state.isEditModalOpen,
      isDeleteModalOpen: state.isDeleteModalOpen,
      isLoading: state.isLoading,
      error: state.error,
    };
  },

  getSearchState: () => {
    const state = doctorStore.state;
    return {
      searchQuery: state.searchQuery,
      filters: state.filters,
      pagination: state.pagination,
    };
  },

  getFormState: () => {
    const state = doctorStore.state;
    return {
      formData: state.formData,
      validationErrors: state.validationErrors,
      currentDoctor: state.currentDoctor,
    };
  },

  hasActiveFilters: () => {
    const state = doctorStore.state;
    return (
      state.searchQuery.trim() !== "" ||
      state.filters.status !== "all" ||
      state.filters.gender !== "all" ||
      state.filters.isVerified !== "all" ||
      state.filters.minRating > 0 ||
      state.filters.speciality.trim() !== ""
    );
  },
};

// Custom hooks for using the store
export const useDoctorStore = (selector) => {
  return useStore(doctorStore, selector);
};

export const useDoctorActions = () => {
  return doctorActions;
};

export default doctorStore;

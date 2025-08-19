import { create } from 'zustand';

const useDoctorStore = create((set) => ({
  // Search and filters state
  searchQuery: '',
  filters: {
    status: 'all',
    gender: 'all',
    isVerified: 'all',
    minRating: 0,
    speciality: ''
  },
  pagination: {
    page: 0,
    size: 12
  },

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilter: (key, value) => set((state) => ({
    filters: {
      ...state.filters,
      [key]: value
    }
  })),

  setPage: (page) => set((state) => ({
    pagination: {
      ...state.pagination,
      page
    }
  })),

  setPageSize: (size) => set((state) => ({
    pagination: {
      ...state.pagination,
      size,
      page: 0 // Reset to first page when changing page size
    }
  })),

  resetFilters: () => set({
    searchQuery: '',
    filters: {
      status: 'all',
      gender: 'all',
      isVerified: 'all',
      minRating: 0,
      speciality: ''
    },
    pagination: {
      page: 0,
      size: 12
    }
  })
}));

export { useDoctorStore };

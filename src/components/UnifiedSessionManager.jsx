import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { sessionService } from '../services/sessionService.js';
import { useGetAllDoctors } from '../hooks/useDoctorQueries.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { ConfirmModal } from './ui/confirm-modal.jsx';
import useUserStore from '../store/useUserStore.js';
import { BookOpen, Settings, Plus, Search, Filter } from 'lucide-react';

const UnifiedSessionManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'session-types'
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, type: null });
  const { role } = useUserStore();

  // Search states for both tabs
  const [sessionSearchInputs, setSessionSearchInputs] = useState({
    sessionType: '',
    doctor: '',
    minPrice: '',
    maxPrice: ''
  });

  const [sessionTypeSearchInputs, setSessionTypeSearchInputs] = useState({
    name: '',
    isActive: '',
    isTelemedicineAvailable: '',
    minDuration: '',
    maxDuration: ''
  });

  // Fetch data for both tabs
  const { data: sessionsData, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionService.getAllSessions({ size: 1000 }),
    retry: false,
  });

  const { data: sessionTypesData, isLoading: sessionTypesLoading, error: sessionTypesError, refetch: refetchSessionTypes } = useQuery({
    queryKey: ['sessionTypes'],
    queryFn: () => sessionService.getSessionTypes({ size: 1000 }),
    retry: false,
  });

  const { data: doctorsData } = useGetAllDoctors({ size: 100 });

  // Filter sessions based on search
  const filteredSessions = useMemo(() => {
    const allSessions = sessionsData?.content || [];
    const { sessionType, doctor, minPrice, maxPrice } = sessionSearchInputs;
    
    if (!sessionType && !doctor && !minPrice && !maxPrice) {
      return allSessions;
    }

    return allSessions.filter(session => {
      if (sessionType && !session.sessionType?.name?.toLowerCase().includes(sessionType.toLowerCase())) return false;
      if (doctor && !session.doctor?.name?.toLowerCase().includes(doctor.toLowerCase())) return false;
      if (minPrice && session.price < parseFloat(minPrice)) return false;
      if (maxPrice && session.price > parseFloat(maxPrice)) return false;
      return true;
    });
  }, [sessionsData?.content, sessionSearchInputs]);

  // Filter session types based on search
  const filteredSessionTypes = useMemo(() => {
    const allSessionTypes = sessionTypesData?.content || [];
    const { name, isActive, isTelemedicineAvailable, minDuration, maxDuration } = sessionTypeSearchInputs;
    
    if (!name && !isActive && !isTelemedicineAvailable && !minDuration && !maxDuration) {
      return allSessionTypes;
    }

    return allSessionTypes.filter(sessionType => {
      if (name && !sessionType.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (isActive && sessionType.isActive !== (isActive === 'true')) return false;
      if (isTelemedicineAvailable && sessionType.isTelemedicineAvailable !== (isTelemedicineAvailable === 'true')) return false;
      if (minDuration && sessionType.defaultDuration < parseInt(minDuration)) return false;
      if (maxDuration && sessionType.defaultDuration > parseInt(maxDuration)) return false;
      return true;
    });
  }, [sessionTypesData?.content, sessionTypeSearchInputs]);

  // Pagination
  const currentData = activeTab === 'sessions' ? filteredSessions : filteredSessionTypes;
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return currentData.slice(startIndex, startIndex + pageSize);
  }, [currentData, currentPage, pageSize]);

  const pagination = useMemo(() => ({
    currentPage,
    totalPages: Math.ceil(currentData.length / pageSize),
    totalElements: currentData.length,
    size: pageSize
  }), [currentData.length, currentPage, pageSize]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleDeleteClick = (item, type) => {
    setDeleteModal({ open: true, item, type });
  };

  const handleDeleteConfirm = async () => {
    const { item, type } = deleteModal;
    if (!item) return;

    try {
      if (type === 'session') {
        await sessionService.deleteSession(item.id);
        refetchSessions();
      } else {
        await sessionService.deleteSessionType(item.id);
        refetchSessionTypes();
      }
      setDeleteModal({ open: false, item: null, type: null });
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const handleToggleActive = async (item, type) => {
    try {
      if (type === 'session-type') {
        if (item.isActive) {
          await sessionService.deactivateSessionType(item.id);
        } else {
          await sessionService.activateSessionType(item.id);
        }
        refetchSessionTypes();
      }
    } catch (error) {
      console.error(`Failed to toggle ${type} status:`, error);
    }
  };

  const clearSearch = () => {
    if (activeTab === 'sessions') {
      setSessionSearchInputs({ sessionType: '', doctor: '', minPrice: '', maxPrice: '' });
    } else {
      setSessionTypeSearchInputs({ name: '', isActive: '', isTelemedicineAvailable: '', minDuration: '', maxDuration: '' });
    }
    setCurrentPage(0);
  };

  const isLoading = activeTab === 'sessions' ? sessionsLoading : sessionTypesLoading;
  const error = activeTab === 'sessions' ? sessionsError : sessionTypesError;
  const hasActiveFilters = activeTab === 'sessions' 
    ? Object.values(sessionSearchInputs).some(v => v)
    : Object.values(sessionTypeSearchInputs).some(v => v);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading {activeTab === 'sessions' ? 'sessions' : 'session types'}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {activeTab === 'sessions' ? 'Session' : 'Session Type'} Access Issue
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => activeTab === 'sessions' ? refetchSessions() : refetchSessionTypes()} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 h-full w-full">
      {/* Header with Tab Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold mr-6">Session Management</h1>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('sessions')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'sessions'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Sessions
            </button>
            <button
              onClick={() => handleTabChange('session-types')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'session-types'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Session Types
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {activeTab === 'sessions' ? (
            <>
              <Button 
                onClick={() => navigate('/session-types/create')} 
                variant="outline"
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Session Type
              </Button>
              <Button 
                onClick={() => navigate('/sessions/add')}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate('/session-types/create')}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Session Type
            </Button>
          )}
        </div>
      </div>

      {/* Search/Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search {activeTab === 'sessions' ? 'Sessions' : 'Session Types'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'sessions' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search by session type..."
                  value={sessionSearchInputs.sessionType}
                  onChange={(e) => setSessionSearchInputs(prev => ({ ...prev, sessionType: e.target.value }))}
                />
                <Input
                  placeholder="Search by doctor name..."
                  value={sessionSearchInputs.doctor}
                  onChange={(e) => setSessionSearchInputs(prev => ({ ...prev, doctor: e.target.value }))}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Min price"
                  value={sessionSearchInputs.minPrice}
                  onChange={(e) => setSessionSearchInputs(prev => ({ ...prev, minPrice: e.target.value }))}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Max price"
                  value={sessionSearchInputs.maxPrice}
                  onChange={(e) => setSessionSearchInputs(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  placeholder="Search by name..."
                  value={sessionTypeSearchInputs.name}
                  onChange={(e) => setSessionTypeSearchInputs(prev => ({ ...prev, name: e.target.value }))}
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={sessionTypeSearchInputs.isActive}
                  onChange={(e) => setSessionTypeSearchInputs(prev => ({ ...prev, isActive: e.target.value }))}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={sessionTypeSearchInputs.isTelemedicineAvailable}
                  onChange={(e) => setSessionTypeSearchInputs(prev => ({ ...prev, isTelemedicineAvailable: e.target.value }))}
                >
                  <option value="">All Types</option>
                  <option value="true">Telemedicine</option>
                  <option value="false">In-Person Only</option>
                </select>
                <Input
                  type="number"
                  placeholder="Min duration"
                  value={sessionTypeSearchInputs.minDuration}
                  onChange={(e) => setSessionTypeSearchInputs(prev => ({ ...prev, minDuration: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Max duration"
                  value={sessionTypeSearchInputs.maxDuration}
                  onChange={(e) => setSessionTypeSearchInputs(prev => ({ ...prev, maxDuration: e.target.value }))}
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 items-center mt-4">
            <Button type="button" variant="outline" onClick={clearSearch}>
              Clear All
            </Button>
            {hasActiveFilters && (
              <div className="text-sm text-blue-600 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Filters active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
        <span>
          Showing {paginatedData.length} of {pagination.totalElements} {activeTab === 'sessions' ? 'sessions' : 'session types'}
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            Filtered from {activeTab === 'sessions' ? sessionsData?.content?.length || 0 : sessionTypesData?.content?.length || 0} total
          </span>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((item) => (
          <Card 
            key={item.id} 
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(activeTab === 'sessions' ? `/sessions/${item.id}` : `/session-types/${item.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {activeTab === 'sessions' ? (item.sessionType?.name || 'Session') : item.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {activeTab === 'session-types' && item.isTelemedicineAvailable && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Telemedicine
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'sessions' ? (
                <div className="space-y-2">
                  <p className="text-sm"><strong>Doctor:</strong> {item.doctor?.name || 'N/A'}</p>
                  <p className="text-sm"><strong>Practice:</strong> {item.practice?.name || 'N/A'}</p>
                  <p className="text-sm"><strong>Price:</strong> ${item.price}</p>
                  <p className="text-sm"><strong>Duration:</strong> {item.duration} mins</p>
                  <p className="text-sm"><strong>Mode:</strong> {item.mode}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <p className="text-sm"><strong>Duration:</strong> {item.defaultDuration} minutes</p>
                </div>
              )}
              
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(activeTab === 'sessions' ? `/sessions/${item.id}/edit` : `/session-types/${item.id}/edit`)}
                >
                  Edit
                </Button>
                {activeTab === 'session-types' && (
                  <Button 
                    size="sm" 
                    variant={item.isActive ? "outline" : "default"}
                    onClick={() => handleToggleActive(item, 'session-type')}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(item, activeTab === 'sessions' ? 'session' : 'session-type')}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters 
              ? `No ${activeTab === 'sessions' ? 'sessions' : 'session types'} found matching your criteria.` 
              : `No ${activeTab === 'sessions' ? 'sessions' : 'session types'} found.`
            }
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearSearch} className="mt-2">
              Clear Filters
            </Button>
          )}
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {currentPage + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, item: null, type: null })}
        title={`Delete ${deleteModal.type === 'session' ? 'Session' : 'Session Type'}`}
        description={`Are you sure you want to delete this ${deleteModal.type === 'session' ? 'session' : 'session type'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default UnifiedSessionManager;
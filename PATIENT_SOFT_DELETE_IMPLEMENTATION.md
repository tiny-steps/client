# Patient Service Soft Delete Implementation

## Overview

This document describes the implementation of soft delete functionality for the Patient Service, following the same pattern as the Doctor Service but simplified for global operations only (no branch-specific scenarios).

## Backend Implementation

### 1. Patient Entity

- **File**: `/server/patient-service/src/main/java/com/tinysteps/patientservice/model/Patient.java`
- **Status Field**: Already has `EntityStatus status = EntityStatus.ACTIVE`
- **Entity Status Enum**: `ACTIVE`, `INACTIVE`, `DELETED`

### 2. Controller Endpoints

- **File**: `/server/patient-service/src/main/java/com/tinysteps/patientservice/controller/PatientController.java`

#### Added Endpoints:

```java
POST /api/v1/patients/{id}/activate
POST /api/v1/patients/{id}/deactivate
PATCH /api/v1/patients/{id}/soft-delete
PATCH /api/v1/patients/{id}/reactivate
GET /api/v1/patients/active
GET /api/v1/patients/deleted
```

### 3. Service Layer

- **Interface**: `/server/patient-service/src/main/java/com/tinysteps/patientservice/service/PatientService.java`
- **Implementation**: `/server/patient-service/src/main/java/com/tinysteps/patientservice/service/impl/PatientServiceImpl.java`

#### Added Methods:

- `activate(UUID id)` - Set status to ACTIVE
- `deactivate(UUID id)` - Set status to INACTIVE
- `softDelete(UUID id)` - Set status to DELETED
- `reactivate(UUID id)` - Set status to ACTIVE
- `findActivePatients()` - Get all active patients
- `findDeletedPatients()` - Get all deleted patients

## Frontend Implementation

### 1. Patient Service

- **File**: `/client/src/services/patientService.js`

#### Added Methods:

- `activatePatient(id)` - POST to activate endpoint
- `deactivatePatient(id)` - POST to deactivate endpoint
- `softDeletePatient(id)` - PATCH to soft-delete endpoint
- `reactivatePatient(id)` - PATCH to reactivate endpoint
- `getActivePatientsList()` - GET active patients
- `getDeletedPatientsList()` - GET deleted patients

### 2. React Query Hooks

- **File**: `/client/src/hooks/usePatientQueries.js`

#### Added Hooks:

- `useActivatePatient()` - Mutation for activating patients
- `useDeactivatePatient()` - Mutation for deactivating patients
- `useSoftDeletePatient()` - Mutation for soft deleting patients
- `useReactivatePatient()` - Mutation for reactivating patients
- `useGetActivePatients()` - Query for active patients
- `useGetDeletedPatients()` - Query for deleted patients

### 3. UI Components

#### PatientsList Component

- **File**: `/client/src/components/PatientsList.jsx`
- **Features**:
  - Status badges (Active/Inactive/Deleted)
  - Conditional action buttons based on patient status
  - Activate/Deactivate/Delete confirmation modals
  - Loading states for all operations

#### PatientDetail Component

- **File**: `/client/src/components/PatientDetail.jsx`
- **Features**:
  - Status indicator in header
  - Conditional action buttons
  - Confirmation modals for all operations
  - Loading states

## Key Differences from Doctor Service

### Simplified Implementation:

1. **No Branch Logic**: Patients have global status only
2. **No Complex Scenarios**: Simple activate/deactivate operations
3. **No Branch Management**: No need for branch-specific modals
4. **Direct Operations**: Operations are immediate without complex scenarios

### Status Flow:

```
ACTIVE → INACTIVE (Deactivate)
INACTIVE → ACTIVE (Activate)
ACTIVE/INACTIVE → DELETED (Soft Delete)
DELETED → ACTIVE (Reactivate)
```

## Security & Permissions

### Backend:

- All operations require `ADMIN` role via `@PreAuthorize("hasRole('ADMIN')")`
- Cache eviction using `@CacheEvict`
- Transaction management with `@Transactional`

### Frontend:

- Confirmation modals prevent accidental operations
- Loading states provide user feedback
- Error handling with appropriate messages

## API Response Format

All endpoints return standardized `ResponseModel<PatientDto>`:

```json
{
  "success": true,
  "message": "Patient activated successfully",
  "data": {
    "id": "uuid",
    "status": "ACTIVE"
    // ... other patient fields
  }
}
```

## Testing

### Backend Testing:

```bash
# Test activation
curl -X POST "http://localhost:8080/api/v1/patients/{id}/activate" \
  -H "Authorization: Bearer <token>"

# Test deactivation
curl -X POST "http://localhost:8080/api/v1/patients/{id}/deactivate" \
  -H "Authorization: Bearer <token>"
```

### Frontend Testing:

- Navigate to `/patients` in the web application
- Test activate/deactivate buttons on patient cards
- Verify status badges update correctly
- Test confirmation modals

## Notes

1. **Cache Management**: All operations invalidate relevant cache entries
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Consistent UI**: Follows the same design patterns as doctor service
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Performance**: Optimistic updates with React Query

This implementation provides a clean, simple, and user-friendly soft delete system for patients while maintaining data integrity and following best practices.

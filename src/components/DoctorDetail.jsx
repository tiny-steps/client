import React, { useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useGetDoctorById, useDeleteDoctor, useActivateDoctor, useDeactivateDoctor } from '../hooks/useDoctorQueries.js';
import { Button } from './ui/button.jsx';
import { Card } from './ui/card.jsx';

const DoctorDetail = () => {
  const pageRef = useRef(null);
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const {
    data: doctor,
    isLoading,
    error,
    refetch,
  } = useGetDoctorById(doctorId);

  const deleteDoctorMutation = useDeleteDoctor();
  const activateDoctorMutation = useActivateDoctor();
  const deactivateDoctorMutation = useDeactivateDoctor();

  useGSAP(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }
    );
  }, []);

  const handleDeleteDoctor = async () => {
    if (window.confirm(`Are you sure you want to delete ${doctor.name}?`)) {
      try {
        await deleteDoctorMutation.mutateAsync(doctor.id);
        navigate('/doctors');
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      if (doctor.status === 'ACTIVE') {
        await deactivateDoctorMutation.mutateAsync(doctor.id);
      } else {
        await activateDoctorMutation.mutateAsync(doctor.id);
      }
    } catch (error) {
      console.error('Error toggling doctor status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Available';
      case 'INACTIVE':
        return 'Inactive';
      case 'SUSPENDED':
        return 'Suspended';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading doctor details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-600">
            Error loading doctor: {error.message}
          </p>
          <div className="flex space-x-2 mt-4">
            <Button onClick={() => refetch()} size="sm">
              Try Again
            </Button>
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              Back to Doctors
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-6">
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-600">Doctor not found.</p>
          <Link
            to="/doctors"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 mt-4"
          >
            Back to Doctors
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              ← Back to Doctors
            </Link>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {doctor.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doctor.status)}`}>
                  {getStatusText(doctor.status)}
                </span>
                {doctor.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                to={`/doctors/${doctor.id}/edit`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              >
                Edit Doctor
              </Link>
              <Button
                onClick={handleToggleStatus}
                variant="outline"
                className={
                  doctor.status === 'ACTIVE'
                    ? 'text-orange-600 hover:bg-orange-50'
                    : 'text-green-600 hover:bg-green-50'
                }
                disabled={activateDoctorMutation.isPending || deactivateDoctorMutation.isPending}
              >
                {activateDoctorMutation.isPending || deactivateDoctorMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {doctor.status === 'ACTIVE' ? 'Deactivating...' : 'Activating...'}
                  </>
                ) : (
                  doctor.status === 'ACTIVE' ? 'Deactivate' : 'Activate'
                )}
              </Button>
              <Button
                onClick={handleDeleteDoctor}
                variant="outline"
                className="text-red-600 hover:bg-red-50"
                disabled={deleteDoctorMutation.isPending}
              >
                {deleteDoctorMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-600 text-4xl font-medium">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-semibold">{doctor.name}</h2>
                {doctor.specializations && doctor.specializations.length > 0 && (
                  <p className="text-gray-600">{doctor.specializations[0].name}</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    {doctor.email && (
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2">{doctor.email}</span>
                      </div>
                    )}
                    {doctor.phone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2">{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.address && (
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <span className="ml-2">{doctor.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Professional Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-2">{doctor.experienceYears} years</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <span className="ml-2">{doctor.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating:</span>
                      <span className="ml-2">
                        {doctor.ratingAverage.toFixed(1)} ⭐ ({doctor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            {doctor.summary && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed">{doctor.summary}</p>
              </Card>
            )}

            {/* Specializations */}
            {doctor.specializations && doctor.specializations.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {spec.name}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{doctor.experienceYears}</div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{doctor.ratingAverage.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{doctor.reviewCount}</div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

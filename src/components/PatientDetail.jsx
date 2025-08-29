import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useGetPatientById, useGetPatientMedicalHistory, useGetPatientAllergies, useDeletePatient } from '../hooks/usePatientQueries.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { ConfirmModal } from './ui/confirm-modal.jsx';

const PatientDetail = () => {
 const navigate = useNavigate();
 const { id } = useParams();
 const [deleteModal, setDeleteModal] = useState({ open: false });

 const { data: patientData, isLoading, error } = useGetPatientById(id);
 const { data: medicalHistoryData } = useGetPatientMedicalHistory(id);
 const { data: allergiesData } = useGetPatientAllergies(id);
 const deletePatient = useDeletePatient();

 const handleDeleteConfirm = async () => {
 try {
 await deletePatient.mutateAsync(id);
 navigate('/patients');
 } catch (error) {
 console.error('Error deleting patient:', error);
 } finally {
 setDeleteModal({ open: false });
 }
 };

 if (isLoading) {
 return (
 <div className="flex justify-center items-center p-8">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
 </div>
 );
 }

 if (error) {
 return (
 <Card className="p-6 bg-red-50 border-red-200">
 <p className="text-red-600">{error.message}</p>
 <Button onClick={() => navigate('/patients')} className="mt-2">
 Back to Patients
 </Button>
 </Card>
 );
 }

 const patient = patientData?.data;
 const medicalHistory = medicalHistoryData?.data || [];
 const allergies = allergiesData?.data || [];

 if (!patient) {
 return (
 <Card className="p-6">
 <p className="text-gray-600">Patient not found.</p>
 <Button onClick={() => navigate('/patients')} className="mt-2">
 Back to Patients
 </Button>
 </Card>
 );
 }

 const calculateAge = (dateOfBirth) => {
 const today = new Date();
 const birthDate = new Date(dateOfBirth);
 let age = today.getFullYear() - birthDate.getFullYear();
 const monthDiff = today.getMonth() - birthDate.getMonth();
 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
 age--;
 }
 return age;
 };

 const calculateBMI = (weight, height) => {
 if (!weight || !height) return null;
 const heightInMeters = height / 100;
 return (weight / (heightInMeters * heightInMeters)).toFixed(1);
 };

 return (
 <div className="p-6 max-w-6xl mx-auto space-y-6">
 {/* Header */}
 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-bold">{patient.firstName} {patient.lastName}</h1>
 <p className="text-gray-600">Patient ID: {patient.id}</p>
 </div>
 <div className="flex gap-2">
 <Button variant="outline" onClick={() => navigate('/patients')}>
 Back to Patients
 </Button>
 <Button variant="outline" onClick={() => navigate(`/patients/${id}/edit`)}>
 Edit Patient
 </Button>
 <Button variant="destructive" onClick={() => setDeleteModal({ open: true })}>
 Delete Patient
 </Button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Personal Information */}
 <Card>
 <CardHeader>
 <CardTitle>Personal Information</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm font-medium text-gray-500">First Name</p>
 <p className="text-lg">{patient.firstName}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Last Name</p>
 <p className="text-lg">{patient.lastName}</p>
 </div>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Email</p>
 <p className="text-lg">{patient.email}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Phone</p>
 <p className="text-lg">{patient.phone}</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm font-medium text-gray-500">Date of Birth</p>
 <p className="text-lg">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Age</p>
 <p className="text-lg">{calculateAge(patient.dateOfBirth)} years</p>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm font-medium text-gray-500">Gender</p>
 <p className="text-lg">{patient.gender}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Blood Group</p>
 <p className="text-lg">
 <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
 {patient.bloodGroup || 'Not specified'}
 </span>
 </p>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Medical Information */}
 <Card>
 <CardHeader>
 <CardTitle>Medical Information</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm font-medium text-gray-500">Height</p>
 <p className="text-lg">{patient.height ? `${patient.height} cm` : 'Not specified'}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Weight</p>
 <p className="text-lg">{patient.weight ? `${patient.weight} kg` : 'Not specified'}</p>
 </div>
 </div>
 {patient.height && patient.weight && (
 <div>
 <p className="text-sm font-medium text-gray-500">BMI</p>
 <p className="text-lg">
 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
 {calculateBMI(patient.weight, patient.height)}
 </span>
 </p>
 </div>
 )}
 <div>
 <p className="text-sm font-medium text-gray-500">Medical History</p>
 <p className="text-gray-700">{patient.medicalHistory || 'No medical history recorded'}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Current Medications</p>
 <p className="text-gray-700">{patient.currentMedications || 'No current medications'}</p>
 </div>
 </CardContent>
 </Card>

 {/* Emergency Contact */}
 <Card>
 <CardHeader>
 <CardTitle>Emergency Contact</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div>
 <p className="text-sm font-medium text-gray-500">Contact Name</p>
 <p className="text-lg">{patient.emergencyContactName || 'Not specified'}</p>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500">Contact Phone</p>
 <p className="text-lg">{patient.emergencyContactPhone || 'Not specified'}</p>
 </div>
 </CardContent>
 </Card>

 {/* Address */}
 <Card>
 <CardHeader>
 <CardTitle>Address</CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-gray-700">{patient.address || 'No address recorded'}</p>
 </CardContent>
 </Card>

 {/* Allergies */}
 <Card>
 <CardHeader>
 <CardTitle>Allergies</CardTitle>
 </CardHeader>
 <CardContent>
 {allergies.length > 0 ? (
 <div className="space-y-2">
 {allergies.map((allergy, index) => (
 <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
 <p className="font-medium text-yellow-800">{allergy.allergen}</p>
 <p className="text-sm text-yellow-700">{allergy.reaction}</p>
 <p className="text-xs text-yellow-600">Severity: {allergy.severity}</p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-500">No known allergies</p>
 )}
 </CardContent>
 </Card>

 {/* Medical History */}
 <Card>
 <CardHeader>
 <CardTitle>Medical History Records</CardTitle>
 </CardHeader>
 <CardContent>
 {medicalHistory.length > 0 ? (
 <div className="space-y-3">
 {medicalHistory.map((record, index) => (
 <div key={index} className="border rounded p-3">
 <p className="font-medium">{record.condition}</p>
 <p className="text-sm text-gray-600">{record.description}</p>
 <p className="text-xs text-gray-500">
 Diagnosed: {new Date(record.diagnosedDate).toLocaleDateString()}
 </p>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-gray-500">No medical history records</p>
 )}
 </CardContent>
 </Card>
 </div>

 {/* Delete Confirmation Modal */}
 <ConfirmModal
 open={deleteModal.open}
 onOpenChange={(open) => setDeleteModal({ open })}
 title="Delete Patient"
 description={`Are you sure you want to delete ${patient.firstName} ${patient.lastName}? This action cannot be undone and will remove all associated medical records.`}
 confirmText="Delete Patient"
 variant="destructive"
 onConfirm={handleDeleteConfirm}
 />
 </div>
 );
};

export default PatientDetail;
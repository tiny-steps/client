import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
 useGetAllEnrichedPatients,
 useDeleteEnrichedPatient,
} from "../hooks/useEnrichedPatientQueries.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { ConfirmModal } from "./ui/confirm-modal.jsx";

const PatientsList = () => {
 const navigate = useNavigate();
 const [currentPage, setCurrentPage] = useState(0);
 const [pageSize] = useState(12);
 const [searchParams, setSearchParams] = useState({});
 const [deleteModal, setDeleteModal] = useState({
 open: false,
 patient: null,
 });

 const { data, isLoading, error, refetch } = useGetAllEnrichedPatients({
 page: currentPage,
 size: pageSize,
 ...searchParams,
 });

 const deletePatient = useDeleteEnrichedPatient();

 const handleSearch = (e) => {
 e.preventDefault();
 const formData = new FormData(e.target);
 setSearchParams({
 name: formData.get("name") || undefined,
 email: formData.get("email") || undefined,
 phone: formData.get("phone") || undefined,
 });
 setCurrentPage(0);
 };

 const handleDeleteConfirm = async () => {
 if (deleteModal.patient) {
 await deletePatient.mutateAsync(deleteModal.patient.id);
 }
 };

 if (isLoading)
 return (
 <div className="flex justify-center items-center p-8">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
 </div>
 );

 if (error)
 return (
 <Card className="p-6 bg-red-50 border-red-200">
 <p className="text-red-600">{error.message}</p>
 <Button onClick={refetch} variant="destructive" className="mt-2">
 Retry
 </Button>
 </Card>
 );

 const patients = data?.data?.content || [];
 const pagination = data?.data || {};

 return (
 <div className="p-6 space-y-6">
 <div className="flex justify-between items-center">
 <h1 className="text-2xl font-bold">Patients</h1>
 <Button
 onClick={() => navigate("/patients/add")}
 className="bg-blue-600 hover:bg-blue-700"
 >
 Add Patient
 </Button>
 </div>

 <Card>
 <CardHeader>
 <CardTitle>Search Patients</CardTitle>
 </CardHeader>
 <CardContent>
 <form
 onSubmit={handleSearch}
 className="grid grid-cols-1 md:grid-cols-3 gap-4"
 >
 <Input name="name" placeholder="Patient name..." />
 <Input name="email" placeholder="Email..." />
 <Input name="phone" placeholder="Phone..." />
 <div className="md:col-span-3 flex gap-2">
 <Button type="submit">Search</Button>
 <Button
 type="button"
 variant="outline"
 onClick={() => {
 setSearchParams({});
 setCurrentPage(0);
 }}
 >
 Clear
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {patients.map((patient) => (
 <Card
 key={patient.id}
 className="hover:shadow-lg transition-all duration-200"
 >
 <CardHeader>
 <CardTitle className="text-lg flex items-center justify-between">
 <span>
 {patient.firstName} {patient.lastName}
 </span>
 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
 {patient.bloodGroup || "N/A"}
 </span>
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-2">
 <p className="text-sm text-gray-600">📧 {patient.email}</p>
 <p className="text-sm text-gray-600">📱 {patient.phone}</p>
 <p className="text-sm text-gray-600">
 🎂 {new Date(patient.dateOfBirth).toLocaleDateString()}
 </p>
 <p className="text-sm text-gray-600">Gender: {patient.gender}</p>
 <div className="flex gap-2 mt-4">
 <Button
 size="sm"
 variant="outline"
 onClick={() => navigate(`/patients/${patient.id}`)}
 >
 View
 </Button>
 <Button
 size="sm"
 variant="outline"
 onClick={() => navigate(`/patients/${patient.id}/edit`)}
 >
 Edit
 </Button>
 <Button
 size="sm"
 variant="destructive"
 onClick={() => setDeleteModal({ open: true, patient })}
 >
 Delete
 </Button>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>

 {patients.length === 0 && (
 <Card className="p-8 text-center">
 <p className="text-gray-600">No patients found.</p>
 </Card>
 )}

 {pagination.totalPages > 1 && (
 <div className="flex justify-center gap-2">
 <Button
 variant="outline"
 onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
 disabled={currentPage === 0}
 >
 Previous
 </Button>
 <span className="flex items-center px-4">
 Page {currentPage + 1} of {pagination.totalPages}
 </span>
 <Button
 variant="outline"
 onClick={() => setCurrentPage((p) => p + 1)}
 disabled={currentPage >= pagination.totalPages - 1}
 >
 Next
 </Button>
 </div>
 )}

 <ConfirmModal
 open={deleteModal.open}
 onOpenChange={(open) => setDeleteModal({ open, patient: null })}
 title="Delete Patient"
 description={`Delete ${deleteModal.patient?.firstName} ${deleteModal.patient?.lastName}?`}
 confirmText="Delete"
 variant="destructive"
 onConfirm={handleDeleteConfirm}
 />
 </div>
 );
};

export default PatientsList;

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import {
 useGetAllPatientEmergencyContacts,
 useDeletePatientEmergencyContact,
 useCreatePatientEmergencyContact,
 useUpdatePatientEmergencyContact,
} from "../../hooks/usePatientEmergencyContactQueries.js";
import { useGetAllEnrichedPatients } from "../../hooks/useEnrichedPatientQueries.js";
import {
 Card,
 CardHeader,
 CardTitle,
 CardContent,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { ConfirmModal } from "../../components/ui/confirm-modal.jsx";
import useUserStore from "../../store/useUserStore.js";
import { Phone, Plus, Search, Edit, Trash2, User, Heart } from "lucide-react";
import PatientEmergencyContactForm from "../../components/forms/PatientEmergencyContactForm.jsx";

const PatientEmergencyContactsPage = () => {
 const { activeItem } = useOutletContext();
 const navigate = useNavigate();
 const [currentPage, setCurrentPage] = useState(0);
 const [pageSize] = useState(12);
 const [deleteModal, setDeleteModal] = useState({
 open: false,
 contact: null,
 });
 const [showContactForm, setShowContactForm] = useState(false);
 const [editingContact, setEditingContact] = useState(null);
 const { role } = useUserStore();

 // Search and filter states
 const [searchInputs, setSearchInputs] = useState({
 name: "",
 patient: "",
 relationship: "",
 });

 // Fetch data
 const {
 data: contactsData,
 isLoading,
 error,
 refetch,
 } = useGetAllPatientEmergencyContacts({
 size: 1000, // Fetch all for client-side filtering
 });

 const { data: patientsData } = useGetAllEnrichedPatients({
 size: 1000,
 });

 // Mutations
 const deleteContactMutation = useDeletePatientEmergencyContact();
 const createContactMutation = useCreatePatientEmergencyContact();
 const updateContactMutation = useUpdatePatientEmergencyContact();

 // Filter contacts based on search criteria
 const filteredContacts = useMemo(() => {
 const allContacts = contactsData?.data?.content || [];
 const allPatients = patientsData?.data?.content || [];

 if (
 !searchInputs.name &&
 !searchInputs.patient &&
 !searchInputs.relationship
 ) {
 return allContacts;
 }

 return allContacts.filter((contact) => {
 // Name filter
 if (
 searchInputs.name &&
 !contact.name?.toLowerCase().includes(searchInputs.name.toLowerCase())
 ) {
 return false;
 }

 // Patient filter
 if (searchInputs.patient) {
 const patient = allPatients.find((p) => p.id === contact.patientId);
 if (
 !patient ||
 !patient.name
 ?.toLowerCase()
 .includes(searchInputs.patient.toLowerCase())
 ) {
 return false;
 }
 }

 // Relationship filter
 if (
 searchInputs.relationship &&
 !contact.relationship
 ?.toLowerCase()
 .includes(searchInputs.relationship.toLowerCase())
 ) {
 return false;
 }

 return true;
 });
 }, [contactsData, patientsData, searchInputs]);

 // Pagination
 const paginatedContacts = useMemo(() => {
 const startIndex = currentPage * pageSize;
 return filteredContacts.slice(startIndex, startIndex + pageSize);
 }, [filteredContacts, currentPage, pageSize]);

 const totalPages = Math.ceil(filteredContacts.length / pageSize);

 // Handle form submission
 const handleFormSubmit = async (formData) => {
 try {
 if (editingContact) {
 await updateContactMutation.mutateAsync({
 id: editingContact.id,
 data: formData,
 });
 } else {
 await createContactMutation.mutateAsync(formData);
 }
 setShowContactForm(false);
 setEditingContact(null);
 refetch();
 } catch (error) {
 console.error("Error saving emergency contact:", error);
 }
 };

 // Handle delete
 const handleDelete = async () => {
 if (deleteModal.contact) {
 try {
 await deleteContactMutation.mutateAsync(deleteModal.contact.id);
 setDeleteModal({ open: false, contact: null });
 refetch();
 } catch (error) {
 console.error("Error deleting emergency contact:", error);
 }
 }
 };

 // Handle edit
 const handleEdit = (contact) => {
 setEditingContact(contact);
 setShowContactForm(true);
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
 <Button onClick={refetch} variant="destructive" className="mt-2">
 Retry
 </Button>
 </Card>
 );
 }

 return (
 <div className="p-6 space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-2xl font-bold">Emergency Contacts</h1>
 <p className="text-gray-600">
 Manage patient emergency contact information
 </p>
 </div>
 <Button
 onClick={() => setShowContactForm(true)}
 className="bg-blue-600 hover:bg-blue-700"
 >
 <Plus className="w-4 h-4 mr-2" />
 Add Emergency Contact
 </Button>
 </div>

 {/* Search and Filter */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Search className="w-5 h-5" />
 Search & Filter
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <label className="block text-sm font-medium mb-1">
 Contact Name
 </label>
 <Input
 placeholder="Search by contact name..."
 value={searchInputs.name}
 onChange={(e) =>
 setSearchInputs((prev) => ({
 ...prev,
 name: e.target.value,
 }))
 }
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1">Patient</label>
 <Input
 placeholder="Search by patient name..."
 value={searchInputs.patient}
 onChange={(e) =>
 setSearchInputs((prev) => ({
 ...prev,
 patient: e.target.value,
 }))
 }
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1">
 Relationship
 </label>
 <Input
 placeholder="Search by relationship..."
 value={searchInputs.relationship}
 onChange={(e) =>
 setSearchInputs((prev) => ({
 ...prev,
 relationship: e.target.value,
 }))
 }
 />
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Results */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {paginatedContacts.map((contact) => {
 const patient = patientsData?.data?.content?.find(
 (p) => p.id === contact.patientId
 );

 return (
 <Card
 key={contact.id}
 className="hover:shadow-lg transition-all duration-200 border-blue-200 bg-blue-50"
 >
 <CardHeader>
 <CardTitle className="text-lg flex items-center justify-between">
 <span className="flex items-center gap-2">
 <Phone className="w-4 h-4" />
 {contact.name}
 </span>
 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
 Emergency
 </span>
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-2">
 <p className="text-sm text-gray-600">
 <strong>Patient:</strong> {patient?.name || "Unknown"}
 </p>
 <p className="text-sm text-gray-600">
 <strong>Relationship:</strong> {contact.relationship || "N/A"}
 </p>
 <p className="text-sm text-gray-600">
 <strong>Phone:</strong> {contact.phone || "N/A"}
 </p>
 <p className="text-sm text-gray-600">
 <strong>Email:</strong> {contact.email || "N/A"}
 </p>
 <p className="text-sm text-gray-600">
 <strong>Address:</strong> {contact.address || "N/A"}
 </p>
 <div className="flex gap-2 mt-4">
 <Button
 size="sm"
 variant="outline"
 onClick={() => handleEdit(contact)}
 >
 <Edit className="w-3 h-3 mr-1" />
 Edit
 </Button>
 <Button
 size="sm"
 variant="destructive"
 onClick={() => setDeleteModal({ open: true, contact })}
 >
 <Trash2 className="w-3 h-3 mr-1" />
 Delete
 </Button>
 </div>
 </CardContent>
 </Card>
 );
 })}
 </div>

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="flex justify-center gap-2">
 <Button
 variant="outline"
 onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
 disabled={currentPage === 0}
 >
 Previous
 </Button>
 <span className="flex items-center px-4">
 Page {currentPage + 1} of {totalPages}
 </span>
 <Button
 variant="outline"
 onClick={() =>
 setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
 }
 disabled={currentPage === totalPages - 1}
 >
 Next
 </Button>
 </div>
 )}

 {/* Emergency Contact Form Modal */}
 {showContactForm && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
 <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
 <PatientEmergencyContactForm
 contact={editingContact}
 onSubmit={handleFormSubmit}
 onCancel={() => {
 setShowContactForm(false);
 setEditingContact(null);
 }}
 />
 </div>
 </div>
 )}

 {/* Delete Confirmation Modal */}
 <ConfirmModal
 open={deleteModal.open}
 onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
 title="Delete Emergency Contact"
 description={`Are you sure you want to delete the emergency contact "${deleteModal.contact?.name}"? This action cannot be undone.`}
 confirmText="Delete"
 onConfirm={handleDelete}
 />
 </div>
 );
};

export default PatientEmergencyContactsPage;

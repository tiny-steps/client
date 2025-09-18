import React from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import PatientsList from "../../components/PatientsList.jsx";

const PatientsPage = () => {
  const { activeItem } = useOutletContext();
  const { data: user } = useUserProfile();

  return (
    <>
      <DashboardHeader
        userName={user?.data.name}
        activeItemDescription={activeItem.description}
      />

      <div className="container mx-auto mt-6">
        <PatientsList />
      </div>
    </>
  );
};

export default PatientsPage;

import React from "react";
import { useOutletContext } from "react-router";
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import SessionManager from "../../components/SessionManager.jsx";

const SessionPage = () => {
 const { activeItem } = useOutletContext();
 const { data: user } = useUserProfile();

 return (
 <>
 <DashboardHeader
 userName={user?.data.name}
 activeItemDescription="Session Management - Create and manage session offerings"
 />

 <div className="container ml-20 mt-6">
 <SessionManager />
 </div>
 </>
 );
};

export default SessionPage;

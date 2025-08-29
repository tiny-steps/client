import React from 'react';
import { useOutletContext } from 'react-router';
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import ReportsManager from '../../components/ReportsManager.jsx';

const ReportPage = () => {
 const { activeItem } = useOutletContext();
 const { data: user } = useUserProfile();

 return (
 <>
 <DashboardHeader
 userName={user?.data.name}
 activeItemDescription={activeItem.description}
 />

 <div className="container ml-20 mt-6">
 <ReportsManager />
 </div>
 </>
 );
};

export default ReportPage;
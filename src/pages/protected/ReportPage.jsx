import React from 'react';
import { useOutletContext } from 'react-router';
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";

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
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Report Generation</h2>
                    <p className="text-gray-600">Generate and view various reports and analytics.</p>
                    {/* Add your reports content here */}
                </div>
            </div>
        </>
    );
};

export default ReportPage;

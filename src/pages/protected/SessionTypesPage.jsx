import React from 'react';
import { useOutletContext } from 'react-router';
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import SessionTypesList from '../../components/SessionTypesList.jsx';

const SessionTypesPage = () => {
    const { activeItem } = useOutletContext();
    const { data: user } = useUserProfile();

    return (
        <>
            <DashboardHeader
                userName={user?.data.name}
                activeItemDescription="Manage Session Types"
            />

            <div className="container ml-20 mt-6">
                <SessionTypesList />
            </div>
        </>
    );
};

export default SessionTypesPage;
import React from 'react';
import { useOutletContext } from 'react-router';
import { useUserProfile } from "@/hooks/useUserQuery.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import TimingManager from '../../components/TimingManager.jsx';

const TimingPage = () => {
    const { activeItem } = useOutletContext();
    const { data: user } = useUserProfile();

    return (
        <>
            <DashboardHeader
                userName={user?.data.name}
                activeItemDescription={activeItem.description}
            />

            <div className="container ml-20 mt-6">
                <TimingManager />
            </div>
        </>
    );
};

export default TimingPage;
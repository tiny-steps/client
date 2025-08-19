import React from 'react';

const DashboardHeader = ({ userName, activeItemDescription }) => {
    return (
        <div className="container ml-20 mt-3">
            <h1 className="text-2xl font-bold mb-1">Hi {userName}</h1>
            <p className="text-gray-600 mb-6">{activeItemDescription}</p>
        </div>
    );
};

export default DashboardHeader;

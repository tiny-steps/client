import React from 'react';

const DashboardHeader = ({ userName, activeItemDescription }) => {
 return (
 <div className="px-4 sm:px-6 lg:px-8 mt-3">
 <h1 className="text-xl sm:text-2xl font-bold mb-1">Hi {userName}</h1>
 <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{activeItemDescription}</p>
 </div>
 );
};

export default DashboardHeader;

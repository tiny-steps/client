import React from "react";
import { useLocation } from "@tanstack/react-router";
import {
 Card,
 CardHeader,
 CardTitle,
 CardContent,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Construction, Plus } from "lucide-react";

const PlaceholderPage = ({ title, description, icon: Icon }) => {
 const location = useLocation();
  
  // Get active item info based on current route
  const getActiveItem = () => {
    const mapping = {
    "/dashboard": {
        "name": "Dashboard",
        "description": "Welcome to Admin Dashboard"
    },
    "/doctors": {
        "name": "Doctor",
        "description": "Manage Doctors with ease"
    },
    "/doctors/awards": {
        "name": "Awards",
        "description": "Manage doctor awards"
    },
    "/doctors/qualifications": {
        "name": "Qualifications",
        "description": "Manage doctor qualifications"
    },
    "/doctors/specializations": {
        "name": "Specializations",
        "description": "Manage doctor specializations"
    },
    "/patients": {
        "name": "Patient",
        "description": "Patient Management is a breeze"
    },
    "/patients/allergies": {
        "name": "Allergies",
        "description": "Manage patient allergies"
    },
    "/patients/medications": {
        "name": "Medications",
        "description": "Manage patient medications"
    },
    "/patients/emergency-contacts": {
        "name": "Emergency Contacts",
        "description": "Manage emergency contacts"
    },
    "/timing": {
        "name": "Timing",
        "description": "Effortless Timing Management"
    },
    "/sessions": {
        "name": "Session",
        "description": "Unified Session & Session Type Management"
    },
    "/sessions/types": {
        "name": "Session Types",
        "description": "Manage session types"
    },
    "/schedule": {
        "name": "Schedule",
        "description": "Appointment Scheduling Made Easy"
    },
    "/reports": {
        "name": "Report",
        "description": "Generate Reports in a Click"
    },
    "/profile": {
        "name": "Profile",
        "description": "Manage your profile"
    }
};
    return mapping[location.pathname] || { name: 'Unknown', description: 'Page' };
  };
  
  const activeItem = getActiveItem();

 return (
 <div className="p-6 h-full w-full">
 <div className="flex justify-between items-center mb-6">
 <div>
 <h1 className="text-2xl font-bold">{title}</h1>
 <p className="text-gray-600">{description}</p>
 </div>
 <Button className="flex items-center gap-2" disabled>
 <Plus size={16} />
 Coming Soon
 </Button>
 </div>

 <Card className="p-8 text-center">
 <Icon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
 <h3 className="text-lg font-semibold text-gray-800 mb-2">
 Under Construction
 </h3>
 <p className="text-gray-600 mb-4">
 This feature is currently being developed. It will be available soon!
 </p>
 <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
 <Construction className="h-4 w-4" />
 <span>Development in progress</span>
 </div>
 </Card>
 </div>
 );
};

export default PlaceholderPage;

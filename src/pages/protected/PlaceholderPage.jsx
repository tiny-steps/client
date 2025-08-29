import React from "react";
import { useOutletContext } from "react-router";
import {
 Card,
 CardHeader,
 CardTitle,
 CardContent,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Construction, Plus } from "lucide-react";

const PlaceholderPage = ({ title, description, icon: Icon }) => {
 const { activeItem } = useOutletContext();

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

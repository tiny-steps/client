import { Card } from "@/components/ui/card";
import { LucideStepBack } from "lucide-react";
import { useState } from "react";
// This hook is required. Create it in `src/hooks/useWindowSize.js` if you haven't.
import { useWindowSize } from "../hooks/useWindowSize";

function FlippableCard({ frontContent, backContent }) {
 const [isFlipped, setIsFlipped] = useState(false);
 const { isMobile, isTablet, isDesktop, breakpoint } = useWindowSize();

 const handleCardClick = () => {
 if (!isMobile) {
 setIsFlipped(!isFlipped);
 }
 };

 return (
 <div
 className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-80 xl:w-96 
 h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 
 [perspective:1000px] transition-all duration-300 ${
 !isMobile ? "cursor-pointer hover:scale-105" : "cursor-default"
 }`}
 onClick={handleCardClick}
 >
 <div
 className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out"
 style={{
 transform:
 isFlipped && !isMobile ? "rotateY(180deg)" : "rotateY(0deg)",
 }}
 >
 {/* Front of the Card */}
 <div className="absolute w-full h-full [backface-visibility:hidden]">
 <Card className="bg-white/90 backdrop-blur-lg border border-white/50 w-full h-full 
 flex items-center justify-center md:justify-between flex-row 
 p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
 {frontContent}
 </Card>
 </div>

 {/* Back of the Card */}
 <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
 <Card className="bg-white/90 backdrop-blur-md border border-white/30 w-full h-full 
 flex flex-col items-start justify-center 
 p-4 sm:p-5 md:p-6 shadow-lg">
 <LucideStepBack
 className="absolute top-3 left-3 sm:top-4 sm:left-4 cursor-pointer 
 hover:text-blue-600 transition-colors duration-200"
 size={isMobile ? 20 : 24}
 onClick={(e) => {
 e.stopPropagation(); // Prevent card from flipping again
 handleCardClick();
 }}
 />
 <div className="mt-8 w-full">
 {backContent}
 </div>
 </Card>
 </div>
 </div>
 </div>
 );
}

export default FlippableCard;

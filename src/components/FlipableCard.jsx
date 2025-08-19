import { Card } from "@/components/ui/card";
import { LucideStepBack } from "lucide-react";
import { useState } from "react";
// This hook is required. Create it in `src/hooks/useWindowSize.js` if you haven't.
import { useWindowSize } from "../hooks/useWindowSize";

function FlippableCard({ frontContent, backContent }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const { width } = useWindowSize();
    const isMobile = width < 768; // Tailwind's 'md' breakpoint

    const handleCardClick = () => {
        if (!isMobile) {
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <div
            className={`relative w-80 h-48 md:h-72 [perspective:1000px] ${
                !isMobile ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={handleCardClick}
        >
            <div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
                style={{
                    transform:
                        isFlipped && !isMobile ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front of the Card */}
                <div className="absolute w-full h-full [backface-visibility:hidden]">
                    <Card className="bg-white/90 backdrop-blur-lg border border-white/50 dark:bg-gray-800/40 dark:border-gray-700/50 w-full h-full flex items-center justify-center md:justify-between flex-row p-6 md:p-8 shadow-xl">
                        {frontContent}
                    </Card>
                </div>

                {/* Back of the Card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <Card className="bg-white/90 backdrop-blur-md border border-white/30 dark:bg-gray-800/20 dark:border-gray-700/30 w-full h-full flex flex-col items-start justify-center p-6 shadow-lg">
                        <LucideStepBack
                            className="absolute top-4 left-4 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card from flipping again
                                handleCardClick();
                            }}
                        />
                        {backContent}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default FlippableCard;

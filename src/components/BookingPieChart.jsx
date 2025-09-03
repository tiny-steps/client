import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const BookingPieChart = ({ data, size = 150, showLegend = false }) => {
  const chartRef = useRef(null);

  // Ensure data is valid and has numeric values
  const validData =
    data?.filter(
      (item) =>
        item &&
        typeof item.value === "number" &&
        !isNaN(item.value) &&
        item.value >= 0
    ) || [];

  const total = validData.reduce((sum, item) => sum + item.value, 0);

  // Animate the chart when the component mounts
  useEffect(() => {
    if (!chartRef.current) return;

    const paths = chartRef.current.querySelectorAll("path.pie-segment");
    gsap.fromTo(
      paths,
      {
        scale: 0,
        transformOrigin: "center center",
      },
      {
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        stagger: 0.15,
      }
    );
  }, [data]);

  // Calculate pie chart segments
  const createPieSegments = () => {
    if (total === 0) return [];

    let cumulativeAngle = 0;
    const radius = 15.9155;
    const center = 18;

    return validData
      .map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;

        if (percentage === 0 || isNaN(percentage) || isNaN(angle)) return null;

        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;

        // Convert to radians
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        // Calculate coordinates
        const x1 = center + radius * Math.cos(startAngleRad);
        const y1 = center + radius * Math.sin(startAngleRad);
        const x2 = center + radius * Math.cos(endAngleRad);
        const y2 = center + radius * Math.sin(endAngleRad);

        // Large arc flag
        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
          `M ${center} ${center}`, // Move to center
          `L ${x1} ${y1}`, // Line to start point
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
          "Z", // Close path
        ].join(" ");

        cumulativeAngle += angle;

        return (
          <path
            key={index}
            className="pie-segment"
            d={pathData}
            fill={item.color}
            stroke="white"
            strokeWidth="0.5"
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <svg
          ref={chartRef}
          width={size}
          height={size}
          viewBox="0 0 36 36"
          className="transform"
        >
          {createPieSegments()}
          {/* Center circle for donut effect (optional) */}
          <circle cx="18" cy="18" r="6" fill="white" className="" />
        </svg>
        {/* Total in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700 ">{total}</span>
        </div>
      </div>

      {/* Legend - only show if showLegend is true */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
          {validData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 ">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPieChart;

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

const BurgerMorphIcon = () => {
  const [isCross, setIsCross] = useState(false);
  const topLine = useRef(null);
  const middleLine = useRef(null);
  const bottomLine = useRef(null);
  const crossLine1 = useRef(null);
  const crossLine2 = useRef(null);

  const handleClick = () => {
    setIsCross((prev) => !prev);
    console.log("icon clicked"); // Log action

    if (!isCross) {
      // Morph to cross
      gsap.to(topLine.current, {
        duration: 0.5,
        morphSVG: crossLine1.current,
        ease: "power2.inOut",
      });
      gsap.to(bottomLine.current, {
        duration: 0.5,
        morphSVG: crossLine2.current,
        ease: "power2.inOut",
      });
      gsap.to(middleLine.current, {
        duration: 0.5,
        opacity: 0,
        ease: "power2.inOut",
      });
    } else {
      // Morph back to hamburger
      gsap.to(topLine.current, {
        duration: 0.5,
        morphSVG: "#topLine",
        ease: "power2.inOut",
      });
      gsap.to(bottomLine.current, {
        duration: 0.5,
        morphSVG: "#bottomLine",
        ease: "power2.inOut",
      });
      gsap.to(middleLine.current, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <svg width="40" height="40" viewBox="0 0 100 100" onClick={handleClick}>
      {/* Hamburger lines */}
      <path
        id="topLine"
        ref={topLine}
        d="M20 30 Q50 30 80 30"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        id="middleLine"
        ref={middleLine}
        d="M20 50 Q50 50 80 50"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        id="bottomLine"
        ref={bottomLine}
        d="M20 70 Q50 70 80 70"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cross lines (hidden, used for morph targets) */}
      <path
        ref={crossLine1}
        d="M30 30 Q50 50 70 70"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        style={{ display: "none" }}
      />
      <path
        ref={crossLine2}
        d="M70 30 Q50 50 30 70"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        style={{ display: "none" }}
      />
    </svg>
  );
};

export default BurgerMorphIcon;

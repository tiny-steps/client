import React, { createContext, useContext, useState } from "react";

const LogoAnimationContext = createContext();

export const useLogoAnimation = () => {
  const context = useContext(LogoAnimationContext);
  if (!context) {
    throw new Error(
      "useLogoAnimation must be used within LogoAnimationProvider"
    );
  }
  return context;
};

export const LogoAnimationProvider = ({ children }) => {
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const [isLogoInNavbar, setIsLogoInNavbar] = useState(false);

  return (
    <LogoAnimationContext.Provider
      value={{
        isLogoAnimating,
        setIsLogoAnimating,
        isLogoInNavbar,
        setIsLogoInNavbar,
      }}
    >
      {children}
    </LogoAnimationContext.Provider>
  );
};

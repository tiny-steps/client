import React, { useLayoutEffect } from "react";
import LoginForm from "./components/LoginForm";
import logo from "./assets/tiny-steps-logo.webp"; // Adjust the path as necessary
import gsap from "gsap";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // This state is set but not used. Consider using it to show a success message or redirect.

  useLayoutEffect(() => {
    if (isLoggedIn) {
      gsap.to(".logo", {
        scale: 0.4,
        duration: 0.8,
        top: 0,
        left: 0,
        xPercent: 50,
        yPercent: -20,
        position: "fixed",
        ease: "linear",
      });
    }
  }, [isLoggedIn]);

  return (
    <div className="relative w-full h-full">
      <div className="logo absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <picture>
          <img src={logo} alt="Logo" className="h-30 w-30" />
        </picture>
      </div>
      <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default App;

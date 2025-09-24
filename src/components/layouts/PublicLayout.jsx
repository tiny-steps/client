import React from "react";
import CommonHeader from "../CommonHeader.jsx";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <CommonHeader />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default PublicLayout;

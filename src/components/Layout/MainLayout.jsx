import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`flex-1 transition-all duration-300 p-3 overflow-auto`}>
        <Outlet context={{ isSidebarOpen: isOpen }} />
      </div>
    </div>
  );
};

export default MainLayout;

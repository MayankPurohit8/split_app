import { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("Activity");
  return (
    <>
      <div className="h-screen">
        <div className="h-9/10">
          <Outlet />
        </div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
};
export default MainLayout;

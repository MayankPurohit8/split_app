import { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("Activity");
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="">
          <Outlet />
        </div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
};
export default MainLayout;

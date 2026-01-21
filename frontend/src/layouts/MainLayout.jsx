import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpg";
const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("Activity");
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    // OUTER BACKGROUND (fills desktop)
    <div
      className="min-h-dvh max-h-screen flex justify-center bg-cover"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* PHONE CONTAINER */}
      <div className="relative  w-full max-w-[420px] bg-gray-100 min-h-dvh overflow-hidden shadow-xl">
        {/* Scrollable content */}
        <main className="h-full overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>

        {/* Fixed bottom navbar (scoped to phone width) */}

        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="
            fixed bottom-0
            w-full max-w-[420px]
            bg-white border-t border-gray-200
            pb-safe z-50
          "
        />
      </div>
    </div>
  );
};

export default MainLayout;

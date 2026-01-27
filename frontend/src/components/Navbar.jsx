import {
  SquareGanttChart,
  Users,
  ScanLine,
  Handshake,
  UserRound,
  PieChart,
} from "lucide-react";
import { NavLink } from "react-router";
const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <div className=" bg-white absolute shadow-2xl  *:flex-1  *:transition-all *:duration-300       shadow-blue-900 text-gray-500 bottom-0 w-full h-1/10 flex  justify-center  ">
        <NavLink
          to="/"
          className={`flex flex-col items-center  justify-center ${
            activeTab === "Activity" ? "bg-black text-white" : ""
          }`}
          onClick={() => setActiveTab("Activity")}
        >
          <SquareGanttChart size={40} />
          <div className="text-sm">Activity</div>
        </NavLink>
        <NavLink
          to="/events"
          className={`flex flex-col items-center  justify-center ${
            activeTab === "Events" ? "bg-black text-white" : ""
          }`}
          onClick={() => setActiveTab("Events")}
        >
          <Users size={40} />
          <div className="text-sm">Events</div>
        </NavLink>
        <NavLink
          className={` rounded-full flex flex-col items-center  justify-center ${
            activeTab === "Create" ? "bg-black text-white" : ""
          }`}
        >
          <div className="bg-amber-200 p-1 rounded-full">
            <PieChart size={40} />
          </div>
          <div className="text-sm">Stats</div>
        </NavLink>
        <NavLink
          to="/friends"
          className={`flex flex-col items-center  justify-center ${
            activeTab === "Friends" ? "bg-black text-white" : ""
          }`}
          onClick={() => setActiveTab("Friends")}
        >
          <Handshake size={40} />
          <div className="text-sm">Friends</div>
        </NavLink>
        <NavLink
          to="profile"
          className={`flex flex-col items-center  justify-center ${
            activeTab === "Profile" ? "bg-black text-white" : ""
          }`}
          onClick={() => setActiveTab("Profile")}
        >
          <UserRound size={40} />
          <div className="text-sm">Profile</div>
        </NavLink>
      </div>
    </>
  );
};
export default Navbar;

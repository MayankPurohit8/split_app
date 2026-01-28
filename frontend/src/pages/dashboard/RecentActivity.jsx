import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import AllActivities from "../activities/AllActivities";

const RecentActivty = () => {
  const navigate = useNavigate();
  const [showSettlementDetails, setShowSettlementDetails] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState("");
  const [activities, setActivities] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [userId, setUserId] = useState("");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/notifications`, {
          withCredentials: true,
        });
        console.log(res.data);
        setActivities(res.data.notifications);
        setUserId(res.data.userId);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSettlements();
  }, []);
  return (
    <>
      <div className="px-5 h-full overflow-scroll relative">
        {showSettlementDetails && (
          <div className="fixed w-full h-screen flex items-start justify-center">
            <SettlementDetails
              settlementId={selectedSettlement}
              setShowSettlementDetails={setShowSettlementDetails}
            />
          </div>
        )}
        <div className=" flex justify-between text-lg px-3 py-5">
          <div className="font-bold ">Activity</div>
          <NavLink
            to={"/activities"}
            className="flex  items-center gap-1 justify-center font-semibold hover:bg-amber-100 px-2 py-1  rounded-xl "
          >
            <div className="">See All</div>
            <ArrowRight size={20} />
          </NavLink>
        </div>
        <div className="     ">
          <div className="h-195 overflow-hidden">
            <AllActivities />
          </div>
          {activities.length > 8 && (
            <NavLink
              to={"/activities"}
              className="  flex py-5 text-lg  w-full  justify-center  text-20xl"
            >
              <div className="flex gap-2 items-center p-2 rounded-xl hover:bg-amber-200">
                <div className="">See All </div>
                <ArrowRight />
              </div>
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentActivty;

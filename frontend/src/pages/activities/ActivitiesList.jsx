import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import SettlementDetails from "../settlements/SettlementDetail";

const ActivtiesList = () => {
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
      <div className="px- h-full overflow-scroll relative ">
        {showSettlementDetails && (
          <div className="fixed w-full h-screen flex items-start justify-center">
            <SettlementDetails
              settlementId={selectedSettlement}
              setShowSettlementDetails={setShowSettlementDetails}
            />
          </div>
        )}
        <div className=" flex  text-lg px-3 py-5">
          <NavLink
            to={"/"}
            className="flex  items-center gap-1 justify-center font-semibold hover:bg-amber-100 px-2 py-1  rounded-xl "
          >
            <ArrowLeft size={20} />
          </NavLink>
        </div>
        <div className=" h-full  flex flex-col gap-5">
          {activities.map((act, index) => (
            <div className="p-5 border-b ">
              <div className=" ">
                <div className="text-2xl font-bold ">{act.message}</div>
                <div className="flex gap-2 font-semibold text-gray-500">
                  <div className="">
                    {new Date(act.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="">
                    ,{" "}
                    {new Date(act.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActivtiesList;

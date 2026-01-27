import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Ellipsis,
  EllipsisVertical,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import SettlementDetails from "../settlements/SettlementDetail";
import { formatDistanceToNow } from "date-fns";
const ActivtiesList = () => {
  const navigate = useNavigate();
  const [showSettlementDetails, setShowSettlementDetails] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState("");
  const [activities, setActivities] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [userId, setUserId] = useState("");
  const types = {
    FRIEND_REQ_SEND: "Friend Request",
    FRIEND_REQ_ACCEPT: "Friend Request Accepted",
    ADDED_TO_EVENT: "Added To New Event",
    EXPENSE_ADDED: "Expense Added",
    SEND_REMAINDER: "Payment Remainder",
    SETTLEMENT_REQ: "Requested Settlement",
    SETTLEMENT_ACCEPT: "Accepted Settlement",
    SETTLEMENT_DECLINED: "Declined Settlement",
  };

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
  const handleClick = (n) => {
    if (["FRIEND_REQ_SEND", "FRIEND_REQ_ACCEPT"].includes(n.type)) {
    }
    if (
      ["ADDED_TO_EVENT", "EXPENSE_ADDED", "SEND_REMAINDER"].includes(n.type)
    ) {
      navigate(`/events/${n.eventId}`);
    }
    if (
      ["SETTLEMENT_REQ", "SETTLEMENT_ACCEPT", "SETTLEMENT_DECLINED"].includes(
        n.type
      )
    ) {
      navigate(`/settlements`);
    }
  };
  return (
    <>
      <div className="  bg-gray-100 h-full overflow-scroll relative ">
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
          <div className="text-3xl font-semibold">Notifications</div>
        </div>
        <div className=" h-full  flex flex-col p-2 gap-3 ">
          {activities.map((act, index) => (
            <div
              onClick={() => handleClick(act)}
              className="flex relative  items-start gap-3 py-3 px-2 rounded-xl bg-white shadow-lg"
            >
              <div className=" border bg-amber-200 border-amber-400  rounded-full p-3">
                <Car size={40} />
              </div>
              <div className=" ">
                <div className="text-lg font-bold ">{types[act.type]}</div>
                <div className=" ">{act.message}</div>
                <div className="flex gap-2 font-semibold text-gray-500">
                  <div className="">
                    {formatDistanceToNow(new Date(act.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
              {!act.seen && (
                <div className="absolute right-0 top-0 p-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-700"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActivtiesList;

import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BanknoteX,
  Car,
  Ellipsis,
  EllipsisVertical,
  User,
  UserCheck,
  UserPlus,
  UserPlus2,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import SettlementDetails from "../settlements/SettlementDetail";
const AllActivities = ({ type }) => {
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

  const renderIcon = (a) => {
    switch (a.type) {
      case "FRIEND_REQ_SEND":
        return <Users />;
      case "FRIEND_REQ_ACCEPT":
        return <UserCheck />;
      case "ADDED_TO_EVENT":
        return <UserPlus />;
      case "EXPENSE_ADDED":
        return <User />;
      case "SEND_REMAINDER":
        return <AlertCircle />;
      case "SETTLEMENT_REQ":
        return <Banknote />;
      case "SETTLEMENT_ACCEPT":
        return <User />;
      case "SETTLEMENT_DECLINED":
        return <BanknoteX />;
    }
  };
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/notifications`, {
          withCredentials: true,
        });
        setActivities(res.data.notifications);
        setUserId(res.data.userId);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSettlements();
  }, []);
  const handleClick = (n) => {
    eventSeen(n);

    if (["FRIEND_REQ_SEND", "FRIEND_REQ_ACCEPT"].includes(n.type)) {
      navigate("/requests");
    } else if (
      ["ADDED_TO_EVENT", "EXPENSE_ADDED", "SEND_REMAINDER"].includes(n.type)
    ) {
      navigate(`/events/${n.eventId}`);
    } else if (
      ["SETTLEMENT_REQ", "SETTLEMENT_ACCEPT", "SETTLEMENT_DECLINED"].includes(
        n.type
      )
    ) {
      navigate(`/settlements`);
    }
  };
  const eventSeen = async (e) => {
    if (e.seen) {
      return;
    }
    try {
      let res = await axios.post(
        `${baseUrl}/api/user/notification/seen`,
        {
          id: e._id,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex h-full flex-col p-2 gap-3">
      {" "}
      {activities.map((act, index) => (
        <div
          onClick={() => handleClick(act)}
          className="flex relative border  border-gray-400 items-start gap-3 py-3 px-2 rounded-xl bg-wite shadow-lg"
        >
          <div className=" border shadow bg-yellow-300 border-amber-400  rounded-full p-2">
            {renderIcon(act)}
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
      ))}{" "}
    </div>
  );
};

export default AllActivities;

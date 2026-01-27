import axios from "axios";
import { Clock, IndianRupeeIcon, UsersRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
const SettlementDetails = ({ settlementId, setShowSettlementDetails }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [settlement, setSettlement] = useState(null);
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/settle/get`, {
          withCredentials: true,
          params: {
            settlementId: settlementId,
          },
        });
        console.log(res.data);
        setSettlement(res.data.settlement);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpense();
  }, []);
  const acceptSettlement = async (s) => {
    try {
      let res = axios.post(
        `${baseUrl}/api/settle/accept`,
        {
          settlementId: s._id,
        },
        { withCredentials: true }
      );
      toast.success("Settlement Accepted");
      setShowSettlementDetails(false);
    } catch (err) {
      console.log(err);
    }
  };
  const rejectSettlement = async (s) => {
    try {
      let res = axios.post(
        `${baseUrl}/api/settle/decline`,
        {
          settlementId: s._id,
        },
        { withCredentials: true }
      );
      toast.success("Settlement Declined");
      setShowSettlementDetails(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {settlement && (
        <div className=" w-4/5  p-5 rounded-xl shadow-md bg-white flex flex-col border-2 border-amber-300 shadow-amber-400">
          <div
            onClick={() => setShowSettlementDetails(false)}
            className="cursor-pointer p-1"
          >
            <X />
          </div>
          <div className="flex flex-col items-center">
            <div className="border h-20 w-20 rounded-full overflow-hidden">
              <img
                src={
                  settlement.toUser._id != userId
                    ? settlement.toUser.avatarUrl
                    : settlement.fromUser.avatarUrl
                }
                alt=""
              />
            </div>
            <div className="font-bold text-3xl">
              {userId != settlement.fromUser._id
                ? settlement.fromUser.name
                : settlement.toUser.name}
            </div>
            <div className="text-md text-xl font-extralight">
              {userId != settlement.fromUser._id ? "paid you" : "was paid"}{" "}
              <span className="font-semibold text-2xl">
                {settlement.amount}
              </span>
            </div>
          </div>

          <div className="mt-5 *:flex *:gap-5 flex flex-col gap-3">
            <div className="">
              <div className="">
                <UsersRound />
              </div>
              <div className="">{settlement.eventId.name}</div>
            </div>
            {settlement.note && (
              <div className="">
                <div className="">
                  <IndianRupeeIcon />
                </div>
                <div className="">{settlement.note}</div>
              </div>
            )}
            <div className="">
              <div className="">
                <Clock />
              </div>
              <div className="">
                <div className="flex gap-2 font-semibold text-gray-500">
                  <div className="">
                    {new Date(settlement.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </div>
                  <div className="">
                    {new Date(settlement.createdAt).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate(`/events/${settlement.eventId._id}`)}
            className="mt-5 p-2 text-center bg-amber-300 rounded-xl  shadow  "
          >
            View Event
          </div>
          {settlement.status == "pending" &&
            settlement.toUser._id != userId && (
              <div className="bg-gray-200 rounded-xl p-2 mt-2 text-center shadow">
                Pending
              </div>
            )}
          {settlement.status == "pending" &&
            settlement.toUser._id == userId && (
              <div className=" flex  justify-around rounded-xl p-2 mt-2 text-center *:shadow *:shadow-black *:active:shadow-none *:transition-all">
                <div
                  onClick={() => acceptSettlement(settlement)}
                  className="bg-green-200 p-2 rounded-xl "
                >
                  Accept
                </div>
                <div
                  onClick={() => rejectSettlement(settlement)}
                  className="bg-red-200 p-2 rounded-xl"
                >
                  Decline
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default SettlementDetails;

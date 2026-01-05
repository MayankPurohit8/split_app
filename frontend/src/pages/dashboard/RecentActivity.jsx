import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import SettlementDetails from "../settlements/SettlementDetail";

const RecentActivty = () => {
  const navigate = useNavigate();
  const [showSettlementDetails, setShowSettlementDetails] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [userId, setUserId] = useState("u1");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/settle/get/user`, {
          withCredentials: true,
        });
        console.log(res.data);
        setSettlements(res.data.settlements);
        setUserId(res.data.userId);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSettlements();
  }, []);
  return (
    <>
      <div className="px- py-10 h-full relative">
        {showSettlementDetails && (
          <div className="fixed w-full h-screen flex items-start justify-center">
            <SettlementDetails
              settlementId={selectedSettlement}
              setShowSettlementDetails={setShowSettlementDetails}
            />
          </div>
        )}
        <div className="flex justify-between text-lg px-3 py-5">
          <div className="font-bold ">Activity</div>
          <NavLink
            to={"/settlements"}
            className="flex  items-center gap-1 justify-center font-semibold hover:bg-amber-100 px-2 py-1  rounded-xl "
          >
            <div className="">See All</div>
            <ArrowRight size={20} />
          </NavLink>
        </div>
        <div className="  mb-10 ">
          {settlements.slice(0, 15).map((set, index) => (
            <div
              className="flex justify-between items-center p-5 hover:bg-gray-200 rounded-xl"
              onClick={() => {
                setSelectedSettlement(set._id);
                setShowSettlementDetails(true);
              }}
            >
              <div className="">
                <div className="text-2xl font-bold ">
                  {set.toUser._id != userId
                    ? set.toUser.name
                    : set.fromUser.name}
                </div>
                <div className="flex gap-2 font-semibold text-gray-500">
                  <div className="">
                    {new Date(set.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="">
                    ,{" "}
                    {new Date(set.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>

              <div
                className={`text-2xl ${
                  set.toUser._id != userId ? "" : "text-green-500"
                }`}
              >
                {set.toUser._id != userId ? "-" + set.amount : "+" + set.amount}
              </div>
            </div>
          ))}
          {settlements.length > 8 && (
            <div className="  flex py-5 text-lg  w-full  justify-center  text-20xl">
              <div className="flex gap-2 items-center p-2 bg-amber-100 rounded-xl hover:bg-amber-200">
                <div className="">See All </div>
                <ArrowRight />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentActivty;

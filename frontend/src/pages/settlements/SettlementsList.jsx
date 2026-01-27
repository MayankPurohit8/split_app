import axios from "axios";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import SettlementDetails from "./SettlementDetail";
import { useAuth } from "../../../context/AuthContext";
const SettlementsList = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [showSettlementDetails, setShowSettlementDetails] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [tab, setTab] = useState("All");
  const [showSettlements, setShowSettlements] = useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/settle/get/user`, {
          withCredentials: true,
        });
        console.log(res.data);
        setSettlements(res.data.settlements);
        setShowSettlements(res.data.settlements);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSettlements();
  }, [showSettlementDetails]);
  useEffect(() => {
    switch (tab) {
      case "All":
        setShowSettlements(settlements);
        break;
      case "Sent":
        setShowSettlements(settlements.filter((s) => s.fromUser._id == userId));
        break;
      case "Recieved":
        setShowSettlements(settlements.filter((s) => s.toUser._id == userId));
        break;
      case "Pending":
        setShowSettlements(settlements.filter((s) => s.status == "pending"));
        break;
      case "Declined":
        setShowSettlements(settlements.filter((s) => s.status == "Declined"));
        break;
      case "Accepted":
        setShowSettlements(settlements.filter((s) => s.status == "Accepted"));
        break;
    }
  }, [tab]);
  return (
    <>
      <div className="w-full h-screen relative">
        {showSettlementDetails && (
          <div className="z-100 fixed w-full h-screen flex items-center justify-center  bg-[#00000063]">
            <SettlementDetails
              settlementId={selectedSettlement}
              setShowSettlementDetails={setShowSettlementDetails}
            />
          </div>
        )}

        <div className="h-full bg-gray-100">
          <div className="flex justify-between text-lg px-3 py-5 ">
            <NavLink
              to={"/"}
              className="flex  items-center gap-1 justify-center font-semibold hover:bg-amber-100 py-1  rounded-xl "
            >
              <div className="">
                <ChevronLeft size={30} />
              </div>
              <div className="text-3xl font-semibold">Settlements</div>
            </NavLink>
          </div>
          <div className="flex px-5 mb-5 gap-4 *:shadow *:p-2 *:rounded-xl *:bg-white ">
            <div
              onClick={() => setTab("All")}
              className={` ${tab == "All" && "border"}`}
            >
              All
            </div>
            <div
              onClick={() => setTab("Sent")}
              className={` ${tab == "Sent" && "border"}`}
            >
              Sent
            </div>
            <div
              onClick={() => setTab("Recieved")}
              className={` ${tab == "Recieved" && "border"}`}
            >
              Recieved
            </div>
            <div
              onClick={() => setTab("Pending")}
              className={` ${tab == "Pending" && "border"}`}
            >
              Pending
            </div>
          </div>
          <div className="p-2 space-y-3 ">
            {showSettlements.map((set, index) => (
              <div
                onClick={() => {
                  setSelectedSettlement(set._id);
                  setShowSettlementDetails(true);
                }}
                className="relative flex bg-white gap-2 shadow items-center p-5 hover:bg-gray-200 rounded-xl"
              >
                <div className="h-20 w-20 rounded-full overflow-hidden">
                  <img
                    src={
                      set.toUser._id != userId
                        ? set.toUser.avatarUrl
                        : set.fromUser.avatarUrl
                    }
                    alt=""
                  />
                </div>
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
                  className={`ml-auto text-2xl ${
                    set.toUser._id != userId ? "" : "text-green-500"
                  }`}
                >
                  {set.toUser._id != userId
                    ? "-" + set.amount
                    : "+" + set.amount}
                </div>
                <div
                  className={`text-[10px] absolute right-0 bottom-0 px-2 py-1 ${
                    set.status == "declined" && "text-red-500"
                  }`}
                >
                  {set.status != "accepted" && set.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettlementsList;

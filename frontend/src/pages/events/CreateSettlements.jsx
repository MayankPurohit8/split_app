import axios from "axios";
import { ChevronLeft, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import SettlementPop from "./SettlementPop";
const CreateSettlements = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const eventId = useParams().eventId;
  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { userId } = useAuth();
  console.log(userId);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/event/get`, {
          params: {
            eventId,
          },
          withCredentials: true,
        });
        setMembers(res.data.memberBalances);
        setMembers((prev) =>
          prev.filter((p) => p.userId._id != userId && p.balance != 0)
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchMembers();
  }, [showPopup]);
  return (
    <>
      {showPopup && (
        <SettlementPop
          selectedMember={selectedMember}
          setShowPopup={setShowPopup}
        />
      )}
      <div className="bg-gray-100 h-full w-full py-5 px-2">
        <div className="flex items-center gap-5 ">
          <ChevronLeft
            size={30}
            className=""
            onClick={() => navigate(`/events/${eventId}`)}
          />
          <div className="text-2xl font-semibold ">Settle Up</div>
        </div>
        <div className="mt-5 space-y-4">
          {members?.map((m) => (
            <div
              onClick={() => {
                setSelectedMember(m);
                setShowPopup(true);
              }}
              className="relative flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs"
            >
              <div className="flex gap-5 items-center">
                <div className="h-18 w-18 border rounded-full overflow-hidden">
                  <img src={m.userId.avatarUrl} />
                </div>
                <div className="">
                  <div className="">@{m.userId.userName}</div>
                  <div className="">{m.userId.name}</div>
                </div>
              </div>
              <div
                className={`text-xl font-semibold ${
                  m.userId.balance > 0 && "text-green-500"
                }`}
              >
                {m.userId.balance}
              </div>
              <div className="text-2xl">
                {m.balance}{" "}
                {m.pendingSettlements && (
                  <div className=" absolute  top-0 right-0 p-2">
                    <Clock size={12} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default CreateSettlements;

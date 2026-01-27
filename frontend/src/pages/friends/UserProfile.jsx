import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import SettlementDetails from "../settlements/SettlementDetail";
const UserProfile = () => {
  const navigate = useNavigate();
  const person = useParams().userId;
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [reqStatus, setReqStatus] = useState("none");
  const [user, setUser] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [settlementId, setSettlementId] = useState(null);
  const [showSettlementDetails, setShowSettlementDetails] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/profile`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchUserProfile = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/user/people/profile`, {
          params: {
            personId: person,
          },
          withCredentials: true,
        });

        setToUser(res.data.user);
        setBalance(res.data.balance);
        setExpenses(res.data.expenses);
        setSettlements(res.data.settlements);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
    fetchUserProfile();
  }, []);
  useEffect(() => {
    const fetchrequestStatus = () => {
      if (!user || !toUser) return;
      const incoming = user.requests.find((u) => u.from == toUser._id);
      if (incoming) {
        setReqStatus("incoming");
        return;
      }
      const requested = toUser.requests.find((u) => u.from == user._id);
      if (requested) {
        setReqStatus("pending");
        return;
      }
      const friends = user.friends?.find((u) => u.userId._id == toUser._id);
      if (friends) {
        setReqStatus("friends");
        return;
      }
      setReqStatus("none");
      return;
    };
    fetchrequestStatus();
  }, [user, toUser]);

  const sendRequest = async () => {
    try {
      let res = await axios.post(
        `${baseUrl}/api/user/friends/send`,
        {
          toUser,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setReqStatus("pending");
    } catch (err) {
      console.log(err);
    }
  };
  const acceptRequest = async () => {
    try {
      let res = await axios.post(
        `${baseUrl}/api/user/friends/accept`,
        {
          fromUser: toUser,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setReqStatus("friends");
    } catch (err) {
      console.log(err);
    }
  };
  const declineRequest = async () => {
    try {
      let res = await axios.post(
        `${baseUrl}/api/user/friends/reject`,
        {
          fromUser: toUser,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setReqStatus("none");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {showSettlementDetails && (
        <div className="fixed w-full h-screen flex items-center justify-center  bg-[#00000063]">
          <SettlementDetails
            settlementId={settlementId}
            setShowSettlementDetails={setShowSettlementDetails}
          />
        </div>
      )}
      <div className="h-screen overflow-scroll  p-5 bg-slate-100">
        <div onClick={() => navigate("/friends")} className="">
          <ChevronLeft />
        </div>
        <div className="px-7 flex items-center flex-col mt-10 h-3/10 ">
          <div className="h-32 w-32 overflow-hidden rounded-full shadow-lg">
            <img src={toUser?.avatarUrl} alt="" className="bg-white" />
          </div>
          <div className="mt-3 text-3xl font-bold text-cyan-900">
            {toUser?.name}
          </div>
          <div className="text-lg ">@{toUser?.userName}</div>
        </div>
        <div className=" mt-2 flex items-center justify-center flex-col">
          {reqStatus == "none" && (
            <div
              onClick={() => sendRequest()}
              className="text-xl font-semibold shadow-lg active:shadow-none transition-all p-4 border rounded-2xl bg-amber-200 active:bg-amber-300"
            >
              Send Friend Request
            </div>
          )}
          {reqStatus === "incoming" && (
            <div className="flex flex-col items-center gap-5">
              <div className="text-xl font-semibold text-slate-500">
                Sent You a Friend Request :
              </div>
              <div className="flex gap-5">
                <div
                  onClick={() => acceptRequest()}
                  className="text-xl font-semibold shadow-lg active:shadow-none transition-all p-4 border rounded-2xl bg-green-200 active:bg-green-300"
                >
                  Accept
                </div>
                <div
                  onClick={() => declineRequest()}
                  className="text-xl font-semibold shadow-lg active:shadow-none transition-all p-4 border rounded-2xl bg-red-200 active:bg-red-300"
                >
                  Decline
                </div>
              </div>
            </div>
          )}
          {reqStatus == "pending" && (
            <div className="text-xl   text-center font-semibold transition-all p-4  rounded-2xl bg-gray-200">
              Request Pending
            </div>
          )}
        </div>
        {reqStatus === "friends" && (
          <div className="text-xl   text-center font-semibold transition-all p-4  rounded-2xl text-green-400 bg-green-200">
            Friends
          </div>
        )}
        <div className="mt-5 mb-5  text-2xl flex items-end gap-5">
          <div className="">Balance:</div>{" "}
          <div className="text-3xl font-semibold">{balance}</div>
        </div>
        <div className="mt-5">
          {expenses.length != 0 && <div className="mb-2">Expenses:</div>}
          <div className="flex flex-col gap-5">
            {expenses.map((exp, index) => (
              <div
                onClick={() => {
                  navigate(`/expense/${exp._id}`, {
                    state: { eventId: exp.eventId, from: "peopleProfile" },
                  });
                }}
                className=" hover:bg-yellow-200 bg-white rounded-xl p-5 shadow-md flex justify-between"
              >
                <div className="">
                  <div className="font-bold text-xl">{exp.note}</div>
                  <div className="font-semibold text-gray-500">
                    Total Spend :{exp.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          {settlements.length != 0 && <div className="mb-2">Settlements:</div>}

          <div className="flex flex-col gap-5">
            {settlements.map((exp, index) => (
              <div
                onClick={() => {
                  setSettlementId(exp._id);
                  setShowSettlementDetails(true);
                }}
                className=" hover:bg-yellow-200 bg-white rounded-xl p-5 shadow-md flex justify-between"
              >
                <div className="">
                  <div className="font-bold text-xl">{exp.note}</div>
                  <div className="font-semibold text-gray-500">
                    paid : {exp.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default UserProfile;

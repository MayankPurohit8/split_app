import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const UserProfile = () => {
  const navigate = useNavigate();
  const toUser = useLocation().state.user;
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [reqStatus, setReqStatus] = useState("none");
  const [user, setUser] = useState(null);
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

    fetchProfile();
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
      <div className="h-screen  overflow-scroll p-5 bg-slate-100">
        <div onClick={() => navigate("/friends")} className="">
          <ChevronLeft />
        </div>
        <div className="px-7 flex items-center flex-col mt-20 h-3/10">
          <div className="h-32 w-32 overflow-hidden rounded-full shadow-lg">
            <img src={toUser.avatarUrl} alt="" className="bg-white" />
          </div>
          <div className="mt-3 text-3xl font-bold text-cyan-900">
            {toUser.name}
          </div>
          <div className="text-lg ">@{toUser.userName}</div>
        </div>
        <div className="flex items-center justify-center flex-col">
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
      </div>
    </>
  );
};
export default UserProfile;

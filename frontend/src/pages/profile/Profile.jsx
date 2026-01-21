import axios from "axios";
import {
  BookUser,
  ChevronRight,
  FileHeart,
  ReceiptText,
  ScrollText,
  SunMoon,
  UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/profile`, {
          withCredentials: true,
        });
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);
  const logout = async () => {
    try {
      let res = await axios.post(
        `${baseUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("userId");
      toast.success("Logged Out");
      navigate("/");
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <div className="h-full overflow-scroll p-5 bg-slate-100">
        <div className="flex  justify-between text-4xl  font-bold items-start">
          <div className="">Profile</div>
        </div>
        <div className="px-7 flex items-center flex-col mt-7 h-4/10">
          <div className="h-32 w-32 overflow-hidden rounded-full shadow-lg">
            <img src={user.avatarUrl} alt="" className="bg-white" />
          </div>
          <div className="mt-3 text-3xl font-bold text-cyan-900">
            {user.name}
          </div>
          <div className="text-lg ">@{user.userName}</div>
        </div>
        <div className="">
          <div className="text-xl font-semibold text-gray-500">Settings</div>
          <div className="*:hover:shadow-2xl *:flex *:items-center *:justify-between *:gap-5 *:bg-white flex flex-col px-5 py-3 text-xl font-semibold *:px-3 gap-1 *:py-5 *:rounded-xl">
            <div
              onClick={() =>
                navigate("/profile/edit", {
                  state: {
                    name: user.name,
                    userName: user.userName,
                    avatarUrl: user.avatarUrl,
                  },
                })
              }
              className=""
            >
              <div className="p-2 bg-slate-200 rounded-full">
                <UserPen />
              </div>
              <div className="">Edit Profile</div>
              <div className="">
                <ChevronRight />
              </div>
            </div>
            <div onClick={() => navigate("/settlements")} className="">
              <div className="p-2 bg-slate-200 rounded-full">
                <ScrollText />
              </div>
              <div className="">User Settlements</div>
              <div className="">
                <ChevronRight />
              </div>
            </div>
            <div className="">
              <div className="p-2 bg-slate-200 rounded-full">
                <BookUser />
              </div>
              <div className="">Friend Requests</div>
              <div className="">
                <ChevronRight />
              </div>
            </div>
            <div className="">
              <div className="p-2 bg-slate-200 rounded-full">
                <SunMoon />
              </div>
              <div className="">Theme</div>
              <div className="">
                <ChevronRight />
              </div>
            </div>
            <div className="text-center">
              <div className="p-2 bg-slate-200 rounded-full">
                <ReceiptText />
              </div>
              <div className="">Terms and Conditions</div>
              <div className="">
                <ChevronRight />
              </div>
            </div>
            <div className="">
              <div className="p-2 bg-slate-200 rounded-full">
                <FileHeart />
              </div>
              <div className="">About</div>
              <div className="">
                <ChevronRight />
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            logout();
          }}
          className=" flex items-center w-full text-2xl text-center mt-5 font-semibold rounded-2xl text-white  transition-all hover:text-white"
        >
          <div className="bg-red-500  p-3 rounded-xl hover:bg-red-600">
            LOGOUT
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;

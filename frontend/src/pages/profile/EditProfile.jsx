import { Check, ChevronLeft, Shuffle, X } from "lucide-react";
import { avatarGenerator } from "../../../utils/avatarGenerator";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const EditProfile = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const user = useLocation().state;
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [validUsername, setValidUsername] = useState(false);
  const [userName, setuserName] = useState(user.userName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const checkUsernameValidity = async () => {
    try {
      const res = await axios.post(`${baseUrl}/api/auth/checkusername`, {
        username: userName,
      });

      console.log(res.data);
      setValidUsername(res.data.avaliable);
    } catch (err) {
      console.log(err);
    }
  };
  const update = async () => {
    try {
      await checkUsernameValidity();
      if (!validUsername) {
        toast.error("Invalid Username");
        return;
      }
      let res = await axios.post(
        `${baseUrl}/api/user/profile/edit`,
        {
          name,
          userName,
          avatarUrl,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="p-5 bg-gray-100 h-screen">
        <div className="flex items-start gap-5">
          <div
            onClick={() => navigate("/profile")}
            className="p-1 rounded-full hover:bg-gray-400 active:bg-gray-500"
          >
            <ChevronLeft size={35} />
          </div>
          <div className="text-4xl font-bold">Edit Profile</div>
        </div>
        <div className="mt-15 flex items-center flex-col gap-5">
          <div className="bg-white overflow-hidden h-35 w-35 shadow-lg rounded-full">
            <img src={avatarUrl} alt="" />
          </div>
          <div
            onClick={() => setAvatarUrl(avatarGenerator())}
            className="p-2 rounded-full bg-amber-200 active:bg-amber-300"
          >
            <Shuffle />
          </div>
        </div>
        <div className="mt-10">
          <div className="font-bold">General Details</div>
          <div className="flex flex-col gap-5 px-5 *:py-3">
            <div className="space-y-3">
              <div className="text-2xl font-bold">Name</div>
              <div className="bg-white px-5 py-4 rounded-2xl">
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  value={name}
                  className="text-xl outline-none font-semibold"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-2xl font-bold">Username</div>
              <div className="relative bg-white px-5 py-4 rounded-2xl">
                <input
                  onBlur={checkUsernameValidity}
                  onChange={(e) => setuserName(e.target.value)}
                  className=" text-xl outline-none font-semibold "
                  type="text"
                  value={userName}
                />
                <div
                  className={`absolute right-4 bottom-4 ${
                    validUsername ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {userName != user.userName &&
                    (validUsername ? <Check /> : <X />)}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 w-full flex flex-col items-center">
            <div
              onClick={() => update()}
              className="bg-amber-200 font-semibold text-3xl px-3 py-4 rounded-xl active:bg-amber-400"
            >
              Update
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditProfile;

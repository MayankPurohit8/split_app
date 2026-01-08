import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import AddFriends from "./AddFriends";
import axios from "axios";
import { useNavigate } from "react-router";
const FriendsList = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [searchFriends, setSearchFriends] = useState(false);
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
  return (
    <>
      <div className={`bg-slate-100 h-full p-5 relative  overflow-scroll`}>
        {searchFriends && (
          <div className="absolute bg-white  top-50 left-10 shadow-2xl border-white rounded-2xl w-4/5 h-1/2">
            <AddFriends />
            <div
              onClick={() => setSearchFriends(false)}
              className=" top-0  absolute  p-1 rounded-full border bg-red-400 text-white"
            >
              <X />
            </div>
          </div>
        )}
        <header className="flex justify-between items-center">
          <div className="font-bold text-4xl">Friends</div>
          <div className="flex space-x-10 items-center ">
            <div
              className="hover:bg-slate-200 rounded-full p-2 "
              onClick={() => setSearchFriends(true)}
            >
              <Search size={30} />
            </div>
            <div className="bg-yellow-200 p-2 rounded-xl">
              <Plus size={30} />
            </div>
          </div>
        </header>
        <div className="mt-10">
          <div className="">All Friends</div>
          <div className="mt-5 space-y-4">
            {user?.friends?.map((f, idx) => (
              <div className="flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs">
                <div className="flex gap-5 items-center">
                  <div className="h-18 w-18 border rounded-full overflow-hidden">
                    <img src={f.userId.avatarUrl} />
                  </div>
                  <div className="">
                    <div className="">@{f.userId.userName}</div>
                    <div className="">{f.userId.name}</div>
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
export default FriendsList;

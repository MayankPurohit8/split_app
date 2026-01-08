import axios from "axios";
import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const AddFriends = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const add = async (e) => {
    try {
      let res = await axios.post(
        `${baseUrl}/user/friends/send`,
        {
          toUser: e._id,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const searchUser = async () => {
      try {
        let res = await axios.post(
          `${baseUrl}/api/user/search`,
          {
            search,
          },
          {
            withCredentials: true,
          }
        );
        setUsers(res.data.users);
        console.log(res.data.users);
      } catch (err) {
        console.log(err);
      }
    };
    searchUser();
  }, [search]);
  return (
    <>
      <div className="w-full h-full p-5">
        <div className="relative mt-5 border border-amber-400  bg-white rounded-full">
          <input
            value={search}
            placeholder="Search for Users"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            className="p-2 outline-none "
          />
          <div className="absolute right-0 top-0 p-2 rounded-full bg-amber-200">
            <Search />
          </div>
        </div>
        <div className="h-8/10 overflow-scroll flex flex-col mt-5 gap-3">
          {users.map((u, idx) => (
            <div
              onClick={() => navigate(`/user/${u._id}`, { state: { user: u } })}
              className="flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs"
            >
              <div className="flex gap-5 items-center">
                <div className="h-18 w-18 border rounded-full overflow-hidden">
                  <img src={u.avatarUrl} />
                </div>
                <div className="">
                  <div className="">@{u.userName}</div>
                  <div className="">{u.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddFriends;

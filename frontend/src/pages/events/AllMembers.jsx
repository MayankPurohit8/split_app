import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
  ChevronLeft,
  Ellipsis,
  EllipsisVertical,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const AllMembers = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const eventId = useParams().eventId;
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [members, setMembers] = useState(null);
  const [menu, showMenu] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [admins, setAdmins] = useState(null);
  const { userId } = useAuth();
  const makeAdmin = async () => {
    try {
      let res = await axios.post(
        `${baseUrl}/event/member/promote`,
        {
          memberId: selectedId,
          eventId: eventId,
        },
        { withCredentials: true }
      );
      console.log(res.data.message);
    } catch (err) {
      console.log(user);
    }
  };
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/event/get`, {
          params: { eventId },
          withCredentials: true,
        });
        setMembers(res.data.event.members);
        setAdmins(res.data.event.admins);
        setAdmin(res.data.isAdmin);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    if (members && admins) diffAdminMember();
  }, []);
  return (
    <>
      <div className="h-screen w-full  bg-slate-100 p-5">
        <div className="flex items-center gap-5 ">
          <ChevronLeft
            size={30}
            className=""
            onClick={() => navigate(`/events/${eventId}`)}
          />
          <div className="text-2xl font-semibold ">All People</div>
        </div>
        <div className="mt-5 border rounded-xl relative ">
          <input
            type="text"
            className="p-2 ml-7 w-8/10 text-xl  outline-none"
            placeholder="Search"
          />
          <div className=" absolute  top-0  p-2">
            <Search />
          </div>
          <div className="absolute right-0 top-0 p-2 ">
            <X />
          </div>
        </div>
        <div className="h-10/12 mt-5 space-y-4  overflow-scroll">
          <div className="">Admins</div>
          {admins?.map((a, idx) => (
            <div className="relative hover:ml-5 transition-all duration-200flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs">
              <div className="flex  gap-5 items-center">
                <div className="h-18 w-18 border rounded-full overflow-hidden">
                  <img src={a.avatarUrl} />
                </div>
                <div className="">
                  <div className="">@{a.userName}</div>
                  <div className="">{a.name}</div>
                </div>
                {userId != a._id && admin && (
                  <div
                    onClick={() => {
                      showMenu(!menu);
                      setSelectedId(a._id);
                    }}
                    className="ml-auto  rounded-full p-1 hover:bg-gray-200"
                  >
                    {menu && selectedId == a._id ? <X /> : <EllipsisVertical />}
                  </div>
                )}
              </div>
              {menu && a._id == selectedId && (
                <div className="z-1 absolute top-8 right-15  transition-all text-xl rounded-lg  bg-slate-200 *:p-2 *:hover:bg-slate-100 *:font-semibold ">
                  <div>Remove Admin</div>
                  <div className="text-red-500">Remove</div>
                </div>
              )}
            </div>
          ))}
          <div className="">Members</div>
          {members?.map((f, idx) => (
            <div className="relative hover:ml-5 transition-all duration-200flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs">
              <div className="flex  gap-5 items-center">
                <div className="h-18 w-18 border rounded-full overflow-hidden">
                  <img src={f.userId.avatarUrl} />
                </div>
                <div className="">
                  <div className="">@{f.userId.userName}</div>
                  <div className="">{f.userId.name}</div>
                </div>
                {admin && f.userId._id != userId && (
                  <div
                    onClick={() => {
                      showMenu(!menu);
                      setSelectedId(f.userId._id);
                    }}
                    className="ml-auto  rounded-full p-1 hover:bg-gray-200"
                  >
                    {menu && selectedId == f.userId._id ? (
                      <X />
                    ) : (
                      <EllipsisVertical />
                    )}
                  </div>
                )}
              </div>
              {menu && f.userId._id == selectedId && (
                <div className="z-1 absolute top-8 right-15  transition-all text-xl rounded-lg  bg-slate-200 *:p-2 *:hover:bg-slate-100 *:font-semibold ">
                  <div>Make Admin</div>
                  <div className="text-red-500">Remove</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default AllMembers;

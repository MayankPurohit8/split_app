import axios from "axios";
import { Check, ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
const AddMembers = () => {
  const navigate = useNavigate();
  const eventId = useParams().eventId;
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [friends, setFriends] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/user/friends`, {
          withCredentials: true,
        });
        console.log(res.data.friends);
        setFriends(res.data.friends.friends);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriends();
  }, []);

  const selected = (id) => {
    return selectedPeople?.some((u) => u.userId._id == id);
  };
  const handleAdd = async () => {
    try {
      let res = await axios.post(
        `${baseUrl}/api/event/member/add`,
        {
          users: selectedPeople,
          eventId,
        },
        { withCredentials: true }
      );
      toast.success("Members added Successfully");
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="p-5 h-screen  bg-slate-100 ">
        <div
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center gap-5 "
        >
          <ChevronLeft size={30} className="" />
          <div className="text-2xl">Add People</div>
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
        {selectedPeople.length != 0 && (
          <div className="transition-all h-30 flex  transform  max-w-screen gap-5  overflow-x-scroll mt-5 p-2">
            {selectedPeople?.map((f) => (
              <div
                key={f.userId._id}
                className="flex relative gap-2 flex-col items-center  "
              >
                <div className="h-18 w-18 overflow-hidden rounded-full border relative">
                  <img src={f.userId.avatarUrl} alt=" h-18 w-18" />
                </div>
                <div
                  onClick={() =>
                    setSelectedPeople((prev) =>
                      prev.filter((p) => p.userId._id != f.userId._id)
                    )
                  }
                  className="absolute right-0 top-0 bg-gray-700 text-white rounded-full"
                >
                  <X />
                </div>
                <div className="">{f.userId.userName}</div>
              </div>
            ))}
            <div className="fixed flex items-center justify-center   bottom-0 left-0 bg-slate-300  h-20 min-w-[420px]">
              <div
                onClick={() => handleAdd()}
                className="px-5 py-2 rounded-xl text-2xl font-bold bg-amber-200"
              >
                Add
              </div>
            </div>
          </div>
        )}

        <div
          className={`${
            selectedPeople?.length == 0 ? "h-10/12" : "h-8/13"
          } mt-5 space-y-4  overflow-scroll`}
        >
          {friends?.map((f, idx) => (
            <div
              onClick={() =>
                !selected(f.userId._id) &&
                setSelectedPeople((prev) => [...prev, f])
              }
              className="hover:ml-5 transition-all duration-200flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs"
            >
              <div className="flex  gap-5 items-center">
                <div className="h-18 w-18 border rounded-full overflow-hidden">
                  <img src={f.userId.avatarUrl} />
                </div>
                <div className="">
                  <div className="">@{f.userId.userName}</div>
                  <div className="">{f.userId.name}</div>
                </div>
                <div className="ml-auto">
                  <Check
                    className={`${
                      selected(f.userId._id) ? "bg-green-400" : "bg-gray-400"
                    } rounded-full text-white `}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddMembers;

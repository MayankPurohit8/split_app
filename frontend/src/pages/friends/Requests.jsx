import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
const Requests = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user/profile`, {
          withCredentials: true,
        });
        console.log(res.data);
        setRequests(res.data.user.requests);
      } catch (err) {
        console.log("something went wrong");
      }
    };
    fetchRequests();
  }, []);

  return (
    <>
      <div className="px-2">
        <div className="flex mt-7">
          <div className="p-2">
            <ChevronLeft size={24} onClick={() => navigate(-1)} />
          </div>
          <div className="text-3xl font-semibold">Friend Requests</div>
        </div>
        <div className="mt-5 space-y-4">
          {requests?.map((u, idx) => (
            <div
              onClick={() => navigate(`/user/${u.from._id}`)}
              className="flex gap-5 bg-white px-5 py-2 items-center rounded-2xl justify-between shadow-2xs"
            >
              <div className="flex gap-5 items-center">
                <div className="h-18 w-18 border rounded-full overflow-hidden">
                  <img src={u.from.avatarUrl} />
                </div>
                <div className="">
                  <div className="">@{u.from.userName}</div>
                  <div className="">{u.from.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Requests;

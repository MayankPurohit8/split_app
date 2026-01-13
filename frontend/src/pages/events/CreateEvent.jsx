import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const CreateEvent = ({ setShowAddEvent }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const createEvent = async () => {
    try {
      if (!name) {
        toast.error("Add Event Name");
        return;
      }
      let res = await axios.post(
        `${baseUrl}/api/event/create`,
        {
          name,
          description,
        },
        { withCredentials: true }
      );

      toast.success("Event Created");
      navigate(`/events/${res.data.event._id}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="h-9/10   justify-end   z-10 w-full  absolute flex backdrop-blur transition-all duration-200">
        <div className="bg-slate-50 h-full w-5/6 shadow-2xl   border-l-4 duration-150 border-amber-300 py-3 px-4 overflow-scroll">
          <div className="text-4xl font-semibold">Create Event</div>
          <div className="mt-10 space-y-5">
            <div className="space-y-3">
              <div className="text-xl">Event Name</div>
              <div className=" bg-white border border-gray-300 shadow-md rounded-lg px-1  py-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className=" outline-none text-xl w-full"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xl">Event Description</div>
              <div className=" bg-white border border-gray-300 shadow-md rounded-lg  py-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name=""
                  id=""
                  cols="20"
                  rows="7"
                  className="outline-none  w-full py-2 px-2 text-xl"
                ></textarea>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              createEvent();
            }}
            className="transition-all mt-20 text-2xl bg-amber-200 p-3 rounded-xl shadow-lg text-center font-bold active:bg-amber-300 active:shadow-none"
          >
            Create
          </div>
          <div
            onClick={() => setShowAddEvent(false)}
            className=" mt-5 text-center text-xl text-gray-400 hover:text-gray-600 hover:underline"
          >
            Cancel
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateEvent;

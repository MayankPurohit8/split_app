import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CreateEvent from "./CreateEvent";
const EventsList = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/event/all`, {
          withCredentials: true,
        });
        const eventWithBalance = await Promise.all(
          res.data.events.map(async (event) => {
            const balanceRes = await axios.get(
              `${baseUrl}/api/event/balance/get`,
              {
                params: { eventId: event._id },
                withCredentials: true,
              }
            );

            return {
              ...event,
              totalExpense: balanceRes.data.totalExpense,
              userBalance: balanceRes.data.userBalance,
            };
          })
        );
        console.log(eventWithBalance);
        setEvents(eventWithBalance);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);
  return (
    <>
      {showAddEvent && <CreateEvent setShowAddEvent={setShowAddEvent} />}
      <div className="h-full w-full overflow-scroll bg-slate-100 p-5 relative">
        <header className="flex justify-between items-center">
          <div className="font-bold text-4xl">Events</div>
          <div className="flex space-x-10 items-center ">
            <div className="">
              <Search size={30} />
            </div>
            <div
              onClick={() => setShowAddEvent(true)}
              className="bg-yellow-200 p-2 rounded-xl"
            >
              <Plus size={30} />
            </div>
          </div>
        </header>
        <main>
          <div className="mt-10">All Events</div>
          <div className="space-y-5 py-5">
            {events &&
              events.map((event, index) => (
                <div
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="hover:bg-yellow-200 bg-white rounded-xl p-5 shadow-md flex justify-between"
                  key={index}
                >
                  <div className="">
                    <div className="text-xl font-semibold">{event.name}</div>
                    <div className="text-lg font-light">
                      {event.description}
                    </div>
                    <div className="text-sm mt-3 flex items-center">
                      {event.members.length - 1} people
                    </div>
                  </div>
                  <div
                    className={`text-3xl ${
                      event.userBalance > 0 ? "text-green-500" : "text-black"
                    }`}
                  >
                    {event.userBalance.toFixed(2)}
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </>
  );
};
export default EventsList;

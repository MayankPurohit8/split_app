import axios from "axios";
import { ArrowLeft, Ellipsis, PieChart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

const EventDetails = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [event, setEvent] = useState({});
  const [admin, setAdmin] = useState(false);
  const [totalExpense, setTotalExpense] = useState("0");
  const [userBalance, setUserBalance] = useState("0");
  const [expenses, setExpenses] = useState([]);
  const eventId = useParams().eventId;
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/event/get`, {
          withCredentials: true,
          params: {
            eventId: eventId,
          },
        });
        setEvent(res.data.event);
        setAdmin(res.data.isAdmin);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchBalance = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/event/balance/get`, {
          withCredentials: true,
          params: {
            eventId: eventId,
          },
        });
        console.log(res);
        setTotalExpense(res.data.totalExpense);
        setUserBalance(res.data.userBalance);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchExpenses = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/expense/get/event`, {
          withCredentials: true,
          params: {
            eventId: eventId,
          },
        });
        console.log(res.data);
        setExpenses(res.data.expenses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvent();
    fetchBalance();
    fetchExpenses();
  }, []);
  return (
    <>
      <div className=" h-screen   bg-[#252323] relative">
        <div className="h-2/6">
          <header className="flex justify-between p-10 text-amber-400">
            <div
              className=""
              onClick={() => {
                navigate("/events");
              }}
            >
              <ArrowLeft />
            </div>
            <div className="flex gap-x-10">
              <div className="">
                <PieChart />
              </div>
              <div className=" transtion-all relative">
                <div
                  className={` transtion-all  transform line shadow-md duration-200 origin-top p-2 w-50 rounded bg-[#1b1b1b]  border-white absolute top-9 right-0 overflow-scroll
 *:rounded-xl *:p-3 *:hover:bg-[#535353] *:hover:px-4 *:transition-all ease-out text-white shadow-black flex flex-col  text-lg
 ${menu ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
                >
                  {admin && (
                    <div
                      className=""
                      onClick={() => navigate(`/events/addmembers/${eventId}`)}
                    >
                      Add Members
                    </div>
                  )}
                  <div
                    onClick={() => navigate(`/events/members/${eventId}`)}
                    className=""
                  >
                    All Members
                  </div>
                  {admin && <div className="text-red-400">Delete Event </div>}
                </div>

                {menu ? (
                  <X onClick={() => setMenu(false)} />
                ) : (
                  <Ellipsis onClick={() => setMenu(true)} />
                )}
              </div>
            </div>
          </header>
          <div className="flex flex-col items-center mt-5 space-y-3">
            <div className="text-4xl font-semibold text-white">
              {event.name}
            </div>
            <div className="text-xl text-gray-300 font-extralight">
              {event.description}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-t-4xl min-h-4/6 p-10">
          <div className="flex justify-between text-center">
            <div className="">
              <div className="text-xl font-semibold">Group Spent:</div>
              <div className="text-3xl font-bold">{totalExpense}</div>
            </div>
            <div className="">
              <div className="font-semibold text-xl">Your Balance:</div>
              <div
                className={`font-bold text-3xl ${
                  userBalance > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {userBalance}
              </div>
            </div>
          </div>
          <hr className="my-5" />
          <div className="text-sm mb-5">expenses made :</div>
          <div className="flex flex-col gap-5">
            {expenses.map((exp, index) => (
              <div
                onClick={() => {
                  navigate(`/expense/${exp._id}`, {
                    state: { eventId: eventId },
                  });
                }}
                className=" hover:bg-yellow-200 bg-white rounded-xl p-5 shadow-md flex justify-between"
              >
                <div className="">
                  <div className="font-bold text-xl">{exp.note}</div>
                  <div className="font-semibold text-gray-500">
                    Total Spend :{exp.amount}
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
export default EventDetails;

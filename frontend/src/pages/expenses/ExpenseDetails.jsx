import axios from "axios";
import { ArrowLeft, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";

const ExpenseDetails = () => {
  const eventId = useLocation().state.eventId;
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [expense, setExpense] = useState(null);
  const expenseId = useParams().expenseId;
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/expense/get`, {
          withCredentials: true,
          params: { expenseId: expenseId },
        });
        console.log(res.data);
        setExpense(res.data.expense);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpense();
  }, []);
  return (
    <>
      {expense && (
        <div className="h-full w-full bg-slate-500 overflow-scroll">
          <div className="h-2/6 p-5">
            <div className="flex justify-between text-amber-300">
              <NavLink to={`/events/${eventId}`} className="">
                <ArrowLeft size={35} />
              </NavLink>
              <div className="">
                <Edit size={35} />
              </div>
            </div>
            <div className="flex flex-col h-4/5 gap-3 justify-center items-center">
              <div className="text-3xl font-light">{expense.eventId.name}</div>
              <div className="text-5xl font-bold">{expense.note}</div>
              <div className="flex gap-2 items-center">
                <div className="text-lg ">last updated on : </div>
                <div className="text-lg">
                  {new Date(expense.updatedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="p-5   min-h-4/6 bg-gray-100 rounded-t-4xl">
            <div className="px-7 ">
              <div className="text-xl font-semibold">Total Bill:</div>
              <div className="text-5xl font-bold">{expense.amount}</div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="font-semibold text-gray-500">Who paid?</div>
              <div className="bg-white px-5 py-3 rounded-2xl space-y-1 flex gap-4 items-center">
                <div className="h-20  shadow-lg shadow-gray-300 rounded-full overflow-hidden w-20">
                  <img src={expense.paidBy.avatarUrl} alt="" />
                </div>
                <div className="">
                  <div className="text-3xl font-bold">
                    {expense.paidBy.name}
                  </div>
                  <div className="text-xl font-semibold">{expense.amount}</div>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="font-semibold text-gray-500">Split among :</div>

              {expense.splits.map((split, idx) => (
                <div className="bg-white rounded-xl p-5 shadow-md flex gap-4 items-center">
                  <div className="h-18  shadow-lg shadow-gray-300 rounded-full overflow-hidden w-18">
                    <img src={split.userId.avatarUrl} alt="" />
                  </div>
                  <div className="">
                    <div className="text-2xl font-bold">
                      {split.userId.name}
                    </div>
                    <div className="text-lg font-semibold">{split.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ExpenseDetails;

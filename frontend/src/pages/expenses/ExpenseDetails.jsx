import axios from "axios";
import { ArrowLeft, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const ExpenseDetails = () => {
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
        <div className="h-screen w-full bg-gray-500">
          <div className="h-1/3 p-5">
            <div className="flex justify-between text-amber-300">
              <div className="">
                <ArrowLeft size={35} />
              </div>
              <div className="">
                <Edit size={35} />
              </div>
            </div>
            <div className="flex flex-col h-4/5 gap-3 justify-center items-center">
              <div className="text-xl font-light">{expense.eventId.name}</div>
              <div className="text-3xl font-bold">{expense.note}</div>
              <div className="flex gap-2 items-center">
                <div className="text-sm ">last updated on : </div>
                <div className="text-sm">
                  {new Date(expense.updatedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 h-2/3 bg-gray-100 rounded-t-4xl">
            <div className="">
              <div className="text-xl">Total Bill:</div>
              <div className="text-3xl font-bold">{expense.amount}</div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="font-semibold text-gray-500">Who paid?</div>
              <div className="bg-white px-5 py-3 rounded-2xl">
                <div className="text-xl font-bold">{expense.paidBy.name}</div>
                <div className="">{expense.amount}</div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="font-semibold text-gray-500">Split among :</div>

              {expense.splits.map((split, idx) => (
                <div className="bg-white px-5 py-3 rounded-2xl">
                  <div className="text-xl font-bold">{split.userId.name}</div>
                  <div className="">{split.amount}</div>
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

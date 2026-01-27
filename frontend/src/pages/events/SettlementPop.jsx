import axios from "axios";
import { Bell, Coins, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
const SettlementPop = ({ selectedMember, setShowPopup }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const eventId = useParams().eventId;
  const [settlementAmount, setSettlementAmount] = useState(
    -selectedMember.balance
  );
  const [toPay, setToPay] = useState(selectedMember.balance < 0);
  const createSettlement = async () => {
    try {
      if (settlementAmount > -selectedMember.balance) {
        toast.error("settlement amount cannot be more than the balance");
        return;
      }
      let res = axios.post(
        `${baseUrl}/api/settle/create`,
        {
          toUser: selectedMember.userId._id,
          amount: settlementAmount,
          eventId,
        },
        {
          withCredentials: true,
        }
      );

      setShowPopup(false);
    } catch (err) {
      console.log(err);
    }
  };
  const sendAlert = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/user/alert`,
        {
          toUser: selectedMember.userId._id,
          eventId: eventId,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setShowPopup(false);
    } catch (err) {}
  };
  return (
    <>
      <div className="z-20 absolute w-full h-full flex items-center justify-center backdrop-blur-lg ">
        <div className="max-h-1/2 w-2/3 border border-amber-300 bg-white rounded-2xl p-2 flex  flex-col ">
          <div
            onClick={() => setShowPopup(false)}
            className="p-1 rounded-full fixed bg-gray-100 active:bg-gray-200 "
          >
            <X />
          </div>
          <div className="flex flex-col items-center gap-3 mt-5">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              <img src={selectedMember.userId.avatarUrl} alt="" />
            </div>
            <div className="">{selectedMember.userId.name}</div>
            {toPay && (
              <div className=" border p-1 text-center">
                <input
                  type="number"
                  className="outline-none text-center text-lg"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                />
              </div>
            )}
            <div className="mb-5 bg-amber-200 px-5 py-2 rounded-xl shadow-xl  active:shadow-none text-xl ">
              {toPay ? (
                <div
                  onClick={() => createSettlement()}
                  className="flex gap-2 items-center"
                >
                  <div className="">Pay</div> <Coins />
                </div>
              ) : (
                <div
                  onClick={() => sendAlert()}
                  className="flex gap-2 items-center"
                >
                  <div className="">Alert</div> <Bell />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SettlementPop;

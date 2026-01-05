import axios from "axios";
import { useEffect, useState } from "react";

const BalanceCard = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [balance, setBalance] = useState("-Settled-");
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/user/getBalance`, {
          withCredentials: true,
        });
        setBalance(res.data.balance);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBalance();
  }, []);
  return (
    <>
      <div className="h-full flex flex-col gap-y-3 items-center justify-center">
        <div className="text-xl font-semibold text-gray-400">My Balance</div>
        <div className="text-white text-5xl font-semibold">{balance}</div>
      </div>
      ;
    </>
  );
};
export default BalanceCard;

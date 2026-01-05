import BalanceCard from "./BalanceCard";
import RecentActivity from "./RecentActivity";

const DashBoard = () => {
  return (
    <>
      <div className="h-screen w-full bg-[#272b30] relative">
        <div className="h-1/3">
          <BalanceCard />
        </div>
        <div className="h-2/3 bg-gray-50 rounded-t-3xl">
          <RecentActivity />
        </div>
      </div>
    </>
  );
};
export default DashBoard;

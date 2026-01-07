import { Plus, Search } from "lucide-react";
import { useState } from "react";
import AddFriends from "./AddFriends";
const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [searhFriends, setSearchFriends] = useState(true);
  return (
    <>
      <div className="bg-slate-100 h-full p-5 relative ">
        <div className="absolute bg-transparent top-50 left-10 border w-4/5 h-1/2">
          {searhFriends && <AddFriends />}
        </div>
        <header className="flex justify-between items-center">
          <div className="font-bold text-4xl">Friends</div>
          <div className="flex space-x-10 items-center ">
            <div className="">
              <Search size={30} />
            </div>
            <div className="bg-yellow-200 p-2 rounded-xl">
              <Plus size={30} />
            </div>
          </div>
        </header>
        <div className="mt-10">
          <div className="">All Friends</div>
          <div className=""></div>
        </div>
      </div>
    </>
  );
};
export default FriendsList;

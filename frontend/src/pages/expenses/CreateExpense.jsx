import axios from "axios";
import {
  Check,
  ChevronDown,
  Ellipsis,
  EllipsisVertical,
  Plus,
  Search,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CreateExpense = ({ eventId, setShowCreateExpense }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const bottomref = useRef(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [members, setMembers] = useState([]);
  const [showSplit, setShowSplit] = useState(false);
  const [splitType, setSplitType] = useState("Equally");
  const [showSplitType, setShowSplitType] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splits, setSplits] = useState([]);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        let res = await axios.get(`${baseUrl}/api/event/get`, {
          params: { eventId },
          withCredentials: true,
        });
        console.log(res);
        setMembers(res.data.event.members);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvent();
  }, []);
  const isSelected = (id) => {
    const exists = selectedMembers.some((m) => m.userId._id === id);
    return exists;
  };
  const toggleMember = (member) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.userId._id === member.userId._id)
        ? prev.filter((m) => m.userId._id !== member.userId._id)
        : [...prev, member]
    );
  };
  const handleSplits = () => {
    setTrigger(!trigger);
    setSplits((prev) => [
      ...prev,
      ...selectedMembers.map((m) => ({
        userId: m.userId._id,
        name: m.userId.name,
        avatarUrl: m.userId.avatarUrl,
        amount: 0,
        percentage: 0,
        locked: false,
      })),
    ]);
  };
  useEffect(() => {
    switch (splitType) {
      case "Equally":
        const forEach = Number((amount / splits.length).toFixed(2));
        const per = Number(((forEach / amount) * 100).toFixed(2));
        setSplits((prev) =>
          prev.map((s) => ({
            ...s,
            amount: forEach,
            percentage: per,
          }))
        );
    }
  }, [showMembers, splitType, members]);

  const handleUnequalSplit = (a, id) => {
    setSplits((prev) =>
      prev.map((s) =>
        s.userId === id
          ? {
              ...s,
              amount: Number(a),
              per: Number(((a / amount) * 100).toFixed(2)),
            }
          : s
      )
    );
  };

  const handlePercentageSplit = (p, id) => {
    setSplits((prev) =>
      prev.map((s) =>
        s.userId === id
          ? {
              ...s,
              amount: Number(((p / 100) * amount).toFixed(2)),
              percentage: p,
              locked: true,
            }
          : s
      )
    );

    const totalLocked = splits
      .filter((u) => u.locked == true)
      .reduce((sum, s) => sum + s.percentage, 0);

    const unlocked = splits.filter((u) => u.locked == false).length;

    let perSplitting = Number(((100 - totalLocked) / unlocked).toFixed(2));
    let am = Number(((perSplitting / 100) * amount).toFixed(2));
    console.log(unlocked + "\n" + perSplitting + "\n" + am);
    if (am < 0) {
      perSplitting = 0;
      am = 0;
    }
    setSplits((prev) =>
      prev.map((s) =>
        s.locked ? s : { ...s, percentage: perSplitting, amount: am }
      )
    );
  };
  useEffect(() => {
    setMembers(
      members.filter((m) => !splits.some((s) => m.userId._id === s.userId))
    );
    bottomref.current?.scrollIntoView({ behavior: "smooth" });
  }, [showMembers, showSplitType]);

  const createExpense = async () => {
    try {
      const totalamount = splits.reduce((sum, s) => sum + s.amount, 0);
      const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
      if (Number((amount - totalamount).toFixed(2)) > 0.01) {
        toast.error("split amount should be equal to total expense");

        return;
      }
      if (splitType == "Percentage" && totalPercentage != 100) {
        toast.error("Percentage not splitted completely");
        return;
      }
      const finalSplit = splits.map((s) => {
        return { amount: s.amount, userId: s.userId };
      });

      let res = await axios.post(
        `${baseUrl}/api/expense/create`,
        {
          amount,
          eventId,
          note,
          paidBy,
          splits: finalSplit,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setShowCreateExpense(false);
    } catch (err) {
      console.log(err);
    }
  };
  if (showMembers) {
    return (
      <div className="max-w-full min-w-full  h-3/4 relative p-6   bg-white rounded-2xl shadow-lg">
        <div className="font-semibold mt-3">Add Split Members</div>
        <div className="mt-3">
          <div className="border p-3 rounded-2xl relative">
            <input type="text" className="text-xl w-full outline-none" />
            <div className="absolute right-2 top-1.5 p-2 rounded-full bg-slate-100 ">
              <Search />
            </div>
          </div>
        </div>
        <div className="mt-5  flex  flex-col gap-3 overflow-scroll  h-2/3 shadow-lg py-3 px-2   bg-gray-100 rounded-xl">
          {members.map((m, idx) => (
            <div
              onClick={() => toggleMember(m)}
              className={` ${
                isSelected(m.userId._id) ? "bg-green-100 border" : "bg-white"
              } flex items-center gap-5 shadow p-2  rounded-2xl `}
            >
              <div className="h-20 w-20 rounded-full overflow-hidden shadow-lg">
                <img src={m.userId.avatarUrl} alt="" className="h-20 w-20 " />
              </div>
              <div className="">
                <div className="">{m.userId.name}</div>
              </div>
              {isSelected(m.userId._id) && (
                <div
                  onClick={() => toggleMember(m)}
                  className="pointer-events-none ml-auto me-3 text-red-500"
                >
                  <Trash2 />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className=" mt-5 flex items-center justify-center">
          <div
            onClick={() => {
              handleSplits();
              setSelectedMembers([]);
              setShowMembers(false);
            }}
            className="p-2 text-center shadow-lg rounded-2xl bg-amber-300 w-1/2"
          >
            Add
          </div>
        </div>
        <div
          onClick={() => {
            setShowMembers(false);
            setSelectedMembers([]);
          }}
          className="absolute -top-5 p-2 bg-gray-200 rounded-full left-0 "
        >
          <X size={35} />
        </div>
      </div>
    );
  }
  if (showSplitType) {
    return (
      <div className="max-w-full min-w-full relative p-6  bg-white rounded-2xl shadow-lg">
        <div onClick={() => setShowSplitType(false)} className="py-2">
          <X color="gray" />
        </div>
        <div className="text-4xl py-5 ">Split Type</div>
        <div className=" flex flex-col gap-5">
          <label className="flex items-center justify-between gap-2 text-gray-700">
            <div className="">Equally(=)</div>
            <div
              onClick={() => setSplitType("Equally")}
              className={`${
                splitType == "Equally" ? "bg-black text-white" : ""
              }  p-1 transition-all rounded-full border-2 border-black] overflow-hidden flex items-center justify-center`}
            >
              <Check />
            </div>
          </label>
          <label className="flex items-center justify-between gap-2 text-gray-700">
            <div className="">Unequally(!=)</div>
            <div
              onClick={() => setSplitType("Unequally")}
              className={`${
                splitType == "Unequally" ? "bg-black text-white" : ""
              }  p-1 transition-all rounded-full border-2 border-black] overflow-hidden flex items-center justify-center`}
            >
              <Check />
            </div>
          </label>
          <label className="flex  items-center justify-between gap-2 text-gray-700">
            <div className="">Percentage(%)</div>
            <div
              onClick={() => setSplitType("Percentage")}
              className={`${
                splitType == "Percentage" ? "bg-black text-white" : ""
              }  p-1 transition-all rounded-full border-2 border-black] overflow-hidden flex items-center justify-center`}
            >
              <Check />
            </div>
          </label>
        </div>
        <div className="flex  items-center justify-center mt-6">
          <div
            onClick={() => setShowSplitType(false)}
            className=" w-full active:shadow-none transition-all shadow-2xl text-center p-2 text-3xl font-semibold bg-amber-300 rounded-xl"
          >
            OK
          </div>
        </div>
      </div>
    );
  } else if (showSplit) {
    return (
      <div className=" max-w-full min-w-full max-h-4/5  overflow-scroll  relative py-6  bg-white rounded-2xl shadow-lg">
        <div className="flex px-6 " onClick={() => setShowSplitType(true)}>
          <div className="">Split Bill {splitType}</div>
          <div className="">
            <ChevronDown />
          </div>
        </div>
        <div className="mt-5  flex  flex-col gap-3 overflow-scroll  h-2/3  py-3 px-2   rounded-xl transition-all">
          {splits?.map((m, idx) => (
            <div className="flex items-center justify-around gap-5 bg-gray-50 shadow p-2  rounded-2xl relative transition-all">
              <div className="h-20 w-20 rounded-full overflow-hidden shadow-lg">
                <img src={m.avatarUrl} alt="" className="h-20 w-20 " />
              </div>
              <div className="w-20">
                <div className="">{m.name}</div>
              </div>
              <div className="bg-white min-w-12 max-w-20 p-1 rounded-2xl text-xl flex ">
                <input
                  type="number"
                  className="min-w-12 max-w-20 outline-none"
                  value={m.amount}
                  disabled={splitType == "Equally"}
                  onChange={(e) =>
                    splitType == "Unequally"
                      ? handleUnequalSplit(e.target.value, m.userId)
                      : ""
                  }
                />
                {splitType == "Percentage" && (
                  <input
                    type="range"
                    value={m.percentage}
                    min={0}
                    max={100}
                    onChange={(e) =>
                      handlePercentageSplit(e.target.value, m.userId)
                    }
                    className="absolute bottom-2 right-10"
                  />
                )}
                {splitType == "Percentage" && (
                  <input
                    type="number"
                    className="text-xs text-gray-600 text-center absolute right-2 top-2 w-10"
                    min={0}
                    max={100}
                    value={m.percentage}
                    onChange={(e) => {
                      let v = Number(e.target.value);
                      if (v > 100) v = 100;
                      if (v < 0) v = 0;
                      setSplits((prev) =>
                        prev.map((s) =>
                          s.userId == m.userId
                            ? {
                                ...s,
                                percentage: v,
                                amount: Number(((v / 100) * amount).toFixed(2)),
                              }
                            : s
                        )
                      );
                    }}
                  />
                )}
              </div>
              <div
                className="text-red-500 p-2 rounded-full "
                onClick={() => {
                  setMembers((prev) => [
                    ...prev,
                    {
                      userId: {
                        _id: m.userId,
                        name: m.name,
                        avatarUrl: m.avatarUrl,
                      },
                    },
                  ]);
                  setSplits((prev) =>
                    prev.filter((s) => s.userId !== m.userId)
                  );
                }}
              >
                <Trash2 />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end mt-6 ">
          <div
            onClick={() => setShowMembers(true)}
            className=" flex items-center gap-5 w-3/4 shadow-2xl bg-gray-100 px-4 py-3 rounded-s-full "
          >
            <div className="p-3 rounded-full bg-amber-300 active:bg-amber-400 transition-all duration-400">
              <Plus />
            </div>
            <div className="text-xl font-semibold">Add Participants</div>
          </div>
        </div>
        <div className="mt-7 flex flex-col items-center px-5">
          <div
            onClick={() => createExpense()}
            className=" text-center text-xl bg-amber-300 p-3 w-full rounded-xl shadow-2xl"
          >
            Create
          </div>
          <div
            onClick={() => setShowSplit(false)}
            className="text-lg font-semibold text-gray-400 mt-3 mb-2"
          >
            back
          </div>
        </div>
        <div ref={bottomref}></div>
      </div>
    );
  } else {
    return (
      <div className="w-full relative py-6 [&>div]:px-6 [&>] bg-white rounded-2xl shadow-lg ">
        <div className=" mt-6 text-3xl font-semibold text-gray-800 mb-6">
          Create Expense
        </div>
        <span
          onClick={() => setShowCreateExpense(false)}
          className="absolute top-0  left-0 p-2 bg-gray-200 active:bg-gray-300"
        >
          <X />
        </span>
        {/* Amount */}
        <div className="mb-4 ">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="₹ 0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Note
          </label>
          <input
            type="text"
            placeholder="Dinner, movie, cab..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full  text-2xl rounded-lg border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Paid By */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Paid By
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3  bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="w-1/2">Select user</option>
            {members.map((m, idx) => (
              <option value={m.userId._id}>{m.userId.name}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button className="w-full flex justify-end   text-gray-900 font-semibold py-2 rounded-lg transition">
          <div
            onClick={() => setShowSplit(true)}
            className="w-3/4 bg-yellow-400 hover:bg-yellow-500 py-3 text-left px-5 rounded-s-2xl"
          >
            Add Splits
          </div>
        </button>
      </div>
    );
  }
};

export default CreateExpense;

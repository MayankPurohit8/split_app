import Expense from "../models/expenseSchema.js";
import Settlement from "../models/settlementSchema.js";
export const findBalance = async (friendId, userId) => {
  const expenses = await Expense.find({
    $or: [
      { paidBy: userId, "splits.userId": friendId },
      { paidBy: friendId, "splits.userId": userId },
    ],
  });

  const settlements = await Settlement.find({
    status: "completed",
    $or: [
      { fromUser: userId, toUser: friendId },
      { fromUser: friendId, toUser: userId },
    ],
  });
  let balance = 0;
  for (const expense of expenses) {
    if (expense.paidBy === userId) {
      const friendSplit = expense.splits.find((e) => e.userId == friendId);
      balance += friendSplit.amount;
    } else {
      const userSplit = expense.splits.find((e) => e.userId == userId);
      balance -= userSplit.amount;
    }
  }
  for (const settlement of settlements) {
    if (settlement.fromUser === userId) {
      balance -= settlement.amount;
    } else {
      balance += settlement.amount;
    }
  }
  return balance;
};

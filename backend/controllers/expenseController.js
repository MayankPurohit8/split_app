import Expense from "../models/expenseSchema.js";
import Event from "../models/eventSchema.js";
export const createExpense = async (req, res) => {
  try {
    const { eventId, paidBy, amount, note, splits } = req.body;
    const userId = req.user.id;
    const user = await findById(userId);
    const event = await Event.findOne({
      _id: eventId,
      "members.userId": userId,
    });
    if (!event) {
      return res.status(400).json({ message: "you are not group member" });
    }
    const newExpense = await Expense.create({
      amount: amount,
      note: note,
      eventId: eventId,
      paidBy: paidBy,
      splits: splits,
    });
    const Notification = await Notification.create({
      type: "EXPENSE_CREATED",
      userId: userId,
      eventId: eventId,
      message: `${user.name} created new expense of ${amount}`,
    });

    return res
      .status(200)
      .json({ message: "new expense created", expense: newExpense });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while creating expense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId, amount, note, splits } = req.body;
    const userId = req.user.id;
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId },
      {
        amount: amount,
        note: note,
        splits: splits,
      }
    );
    return res
      .status(200)
      .json({ message: " expense updated", expense: updateExpense });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while updating expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.body;
    const expense = await Expense.deleteOne({ _id: expenseId });

    return res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while deleting expense" });
  }
};

export const getExpense = async (req, res) => {
  try {
    const { expenseId } = req.query;
    const userId = req.user.id;

    const expense = await Expense.findOne({
      _id: expenseId,
    })
      .populate("splits.userId", "-password -friends -requests -systemAdmin")
      .populate("eventId")
      .populate("paidBy", "-password -friends  -requests -systemAdmin");
    if (!expense) {
      return res.status(400).json({ message: "expense not found" });
    }
    return res.status(200).json({ expense: expense });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while fetching the expense" });
  }
};

export const getEventExpenses = async (req, res) => {
  try {
    const { eventId } = req.query;
    const userId = req.user.id;
    const event = await Event.findOne({
      _id: eventId,
      "members.userId": userId,
    });
    if (!event) {
      return res.status(400).json({ message: "non member , access denied" });
    }
    const expenses = await Expense.find({
      eventId: eventId,
    });

    return res.status(200).json({ expenses: expenses });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while retriving event expenses" });
  }
};

export const getUserExpenses = async (req, res) => {
  try {
    const userID = req.user.id;
    const expenses = await Expense.find({
      "splits.userId": userID,
    })
      .populate("eventId")
      .populate("splits.userId", "-password");

    return res.status(200).json({ expenses: expenses });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while retrieving user expenses" });
  }
};

import Event from "../models/eventSchema.js";
import Expense from "../models/expenseSchema.js";
export const expenseModification = async (req, res, next) => {
  try {
    const { expenseId } = req.body;
    const userId = req.user.id;
    const expense = await Expense.findOne({ _id: expenseId });
    if (expense && expense.paidBy != userId) {
      const eventId = expense.eventId;

      const event = Event.findOne({ _id: eventId, admins: userId });

      if (!event) {
        return res.status(400).json({ message: "Invalid operations" });
      }
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong while validating for expense operatins",
    });
  }
};

export const expenseRetrival = async (req, res, next) => {
  try {
    const { expenseId } = req.query;
    const userId = req.user.id;
    const expense = await Expense.findOne({ _id: expenseId });
    const eventId = expense.eventId;
    const event = Event.findOne({ _id: eventId, "members.userId": userId });

    if (!event) {
      return res.status(400).json({ message: "access denied | not member" });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong while validating for expense operatins",
    });
  }
};

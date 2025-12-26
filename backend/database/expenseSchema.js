import mongoose from "mongoose";
const expenseSchema = mongoose.Schema({
  amount: Number,
  note: String,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  splits: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: Number,
    },
  ],
});

export default mongoose.model("Expense", expenseSchema);

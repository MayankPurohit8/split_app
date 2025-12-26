import mongoose from "mongoose";
import Expense from "./expenseSchema";
import User from "./userSchema";
const eventSchema = mongoose.Schema({
  name: String,
  description: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Event", eventSchema);

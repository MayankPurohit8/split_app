import mongoose from "mongoose";

const settlementSchema = mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "declined"],
    default: "pending",
  },
  note: String,
});

export default mongoose.model("Settlement", settlementSchema);

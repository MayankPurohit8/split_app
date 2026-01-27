import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: [
      "FRIEND_REQ_SEND",
      "FRIEND_REQ_ACCEPT",
      "ADDED_TO_EVENT",
      "EXPENSE_ADDED",
      "SEND_REMAINDER",
      "SETTLEMENT_REQ",
      "SETTLEMENT_ACCEPT",
      "SETTLEMENT_DECLINED",
    ],
  },
  message: String,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  createdAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

export default mongoose.model("Notification", notificationSchema);

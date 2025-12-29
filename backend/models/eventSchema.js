import mongoose from "mongoose";
import User from "./userSchema.js";
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
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      added_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("Event", eventSchema);

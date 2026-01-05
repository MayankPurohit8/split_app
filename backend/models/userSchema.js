import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  systemAdmin: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  requests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
export default mongoose.model("User", UserSchema);

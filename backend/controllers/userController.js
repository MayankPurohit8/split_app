import User from "../models/userSchema.js";
import Expense from "../models/expenseSchema.js";
import Event from "../models/eventSchema.js";
import Notification from "../models/NotificationSchema.js";
import { findBalance } from "../utils/findBalance.js";
const updateUserProfile = async (req, res) => {};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password");

    res.status(200).json({ user: user });
  } catch (err) {
    return res.status(500).json({ message: "could not fetch user profile" });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { toUser } = req.body;
    const fromUserId = req.user.id;
    const fromUserDoc = await User.findById(fromUserId);
    const toUserDoc = await User.findOne({
      $or: [{ userName: toUser }, { email: toUser }],
    });

    if (!toUserDoc) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (fromUserId === toUserDoc._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }
    const exists = await User.findOne({
      _id: toUserDoc._id,
      "requests.from": fromUserId,
    });
    if (exists) {
      return res.status(400).json({ message: "request already sent" });
    }

    const IsFriend = await User.findOne({
      _id: fromUserId,
      "friends.userId": toUserDoc._id,
    });
    if (IsFriend) {
      return res.status(400).json({ message: " already friend" });
    }

    await User.updateOne(
      { _id: toUserDoc._id },
      { $push: { requests: { from: fromUserId } } }
    );
    const notification = await Notification.create({
      userId: toUser,
      type: "FRIEND_REQ_SEND",
      message: `${fromUserDoc.name} sent you a friend request`,
    });
    return res.status(200).json({ message: "Friend request Sent" });
  } catch (err) {
    return res.status(500).json({ message: "could not send request " });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { fromUser } = req.body;
    const toUser = req.user.id;

    const fromUserDoc = await User.findById({ _id: fromUser });
    const toUserDoc = await User.findById({ _id: toUser });

    const alreadyFriend = await User.findOne({
      _id: toUserDoc._id,
      "friends.userId": fromUserDoc._id,
    });

    if (alreadyFriend) {
      return res.status(400).json({ message: "user is already friend" });
    }
    await User.updateOne(
      {
        _id: toUserDoc._id,
        "requests.from": fromUserDoc._id,
      },
      {
        $pull: { requests: { from: fromUserDoc._id } },
        $addToSet: { friends: { userId: fromUserDoc._id } },
      }
    );

    await User.updateOne(
      { _id: fromUserDoc._id },
      { $addToSet: { friends: { friends: toUserDoc._id } } }
    );
    const notification = await Notification.create({
      userId: fromUser,
      type: "FRIEND_REQ_ACCEPT",
      message: `${fromUserDoc.name} accepted friend request`,
    });
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    return res.status(500).jon({ message: "could not accept friend request" });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { fromUser } = req.body;
    const toUser = req.user.id;

    const fromUserDoc = User.findById(fromUser);
    const toUserDoc = User.findById(toUser);

    const alreadyFriend = await User.findOne({
      _id: toUserDoc._id,
      "friends.userId": fromUserDoc._id,
    });

    if (alreadyFriend) {
      return res.status(400).json({ message: "user is already friend" });
    }

    await User.updateOne(
      {
        _id: toUserDoc._id,
        "requests.from": fromUserDoc._id,
      },
      {
        $pull: { requests: { from: fromUser } },
      }
    );

    return res.status(200).json({ message: "rejected friend request" });
  } catch (err) {
    return res.status(500).jon({ message: "could not reject friend request" });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    const userDoc = await User.findById(userId);
    const friendDoc = await User.findById(friendId);

    const findFriend = await User.findOne({
      _id: userDoc._id,
      "friends.userId": friendDoc._id,
    });

    if (!findFriend) {
      res.status(400).json({ message: " friend not found" });
    }

    await User.updateOne(
      { _id: userDoc._id },
      { $pull: { friends: friendDoc._id } }
    );
    await User.updateOne(
      { _id: friendDoc._id },
      { $pull: { friends: userDoc._id } }
    );

    return res.status(200).json({ message: "friend removed" });
  } catch (err) {
    return res.status(500).json({ message: "could not remove friend" });
  }
};
const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "requests.from",
      "_id name email userName phone "
    );

    res.status(200).json({ requests: user.requests });
  } catch (err) {
    res.status(500).json({ message: "requests cannot be fetched" });
  }
};
const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "friends.userId",
      "_id name userName email phone"
    );
    return res.status(200).json({ friends: user.friends });
  } catch (err) {
    return res.status(500).json({ message: "could not fetch friends" });
  }
};

const getUserbalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ "members.userId": userId }).select("_id");
    const expenses = await Expense.find({
      eventId: { $in: events.map((e) => e._id) },
    });
    let balance = 0;
    for (const expense of expenses) {
      const userSplit = expense.splits.find(
        (s) => s.userId.toString() === userId.toString()
      );
      if (expense.paidBy.toString() === userId.toString()) {
        const userShare = userSplit ? userSplit.amount : 0;
        balance += expense.amount - userShare;
      } else if (userSplit) {
        balance -= userSplit.amount;
      }
    }
    return res.status(200).json({ balance: balance });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while retriving user balance" });
  }
};

const getFriendBalanceAndExpenses = async (req, res) => {
  try {
    const { friendId } = req.query;
    const userId = req.user.id;
    const balance = await findBalance(friendId, userId);

    const expenses = await Expense.find({
      $or: [
        { paidBy: userId, "splits.userId": friendId },
        { paidBy: friendId, "splits.userId": userId },
      ],
    });
    return res.status(200).json({ balance: balance, expenses: expenses });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "something went wrong while retriving friend balance" });
  }
};
export {
  getUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendsList,
  getRequests,
  getUserbalance,
  getFriendBalanceAndExpenses,
};

import Settlement from "../models/settlementSchema.js";
import Event from "../models/eventSchema.js";
import User from "../models/userSchema.js";
import { findBalance } from "../utils/findBalance.js";
export const createSettlement = async (req, res) => {
  try {
    const { toUser, amount, eventId } = req.body;
    const fromUser = req.user.id;
    const balance = await findBalance(toUser, fromUser);
    if (balance >= 0) {
      return res.status(400).json({ message: "Invalid Settlement" });
    }
    if (amount > Math.abs(balance)) {
      return res
        .status(400)
        .json({ message: "Settlement amount exceeds balance" });
    }
    const event = await Event.findOne({
      _id: eventId,
      $or: [
        { "members.userId": fromUser, "members.userId": toUser },
        { "members.userId": toUser, "members.userId": fromUser },
      ],
    });

    if (!event) {
      return res.status(400).json({ message: "event Not found" });
    }
    const user = await User.findById(toUser);
    if (!user) {
      return res.status(400).json({ message: "user Not found" });
    }
    const settlement = await Settlement.create({
      fromUser: fromUser,
      toUser: toUser,
      amount: amount,
      eventId: eventId,
    });

    return res
      .status(200)
      .json({ message: "Settlement Created", settlement: settlement });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong while creating settlement" });
  }
};

export const acceptSettlement = async (req, res) => {
  try {
    const { settlementId } = req.body;
    const userId = req.user.id;

    const settlement = await Settlement.findById(settlementId);
    if (!settlement) {
      return res.status(400).json({ message: "settlement does not exist" });
    }

    if (settlement.toUser != userId) {
      return res
        .status(400)
        .json({ message: "permission denied to accept settlement" });
    }

    const updatedSettlement = await Settlement.findOneAndUpdate(
      { _id: settlementId },
      {
        status: "completed",
      }
    );

    return res.status(200).json({
      message: "settlement completed",
      updatedSettlement: updatedSettlement,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while completing settlement" });
  }
};

export const declineSettlement = async (req, res) => {
  try {
    const { settlementId } = req.body;
    const userId = req.user.id;

    const settlement = await Settlement.findById(settlementId);
    if (!settlement) {
      return res.status(400).json({ message: "settlement does not exist" });
    }
    if (settlement.toUser != userId) {
      return res
        .status(400)
        .json({ message: "permission denied to decline settlement" });
    }
    if (settlement.status !== "pending") {
      return res.status(400).json({ message: "Settlement already processed" });
    }
    const updatedSettlement = await Settlement.findOneAndUpdate(
      { _id: settlementId },
      {
        status: "declined",
      }
    );

    return res.status(200).json({
      message: "settlement declined",
      updatedSettlement: updatedSettlement,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while completing settlement" });
  }
};

export const getSettlementHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const settlements = await Settlement.find({
      $or: [{ toUser: userId }, { fromUser: userId }],
    });

    return res.status(200).json({ settlements: settlements });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while fetching settlement" });
  }
};

export const getEventSettlementHistory = async (req, res) => {
  try {
    const { eventId } = req.query;
    const userId = req.user.id;
    const event = await Event.findOne({
      _id: eventId,
      "members.userId": userId,
    });
    if (!event) {
      return res
        .status(400)
        .json({ message: "non member , permission denied" });
    }

    const settlements = await Settlement.find({
      eventId: eventId,
    });

    return res.status(200).json({ settlements: settlements });
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong while fetching event settlements",
    });
  }
};

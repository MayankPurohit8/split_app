import Notification from "../models/NotificationSchema.js";
import Event from "../models/eventSchema.js";
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({
      userId: userId,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while fetching user Notification",
    });
  }
};

export const getEventNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.query;
    const event = await Event.findOne({
      _id: eventId,
      "members.userId": userId,
    });
    if (!event) {
      return res.status(400).json({ message: "Not a member" });
    }
    const notifications = await Notification.find({
      eventId: eventId,
    });
    return res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while fetching user Notification",
    });
  }
};

import Event from "../models/eventSchema.js";
export const checkAdmin = (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    const event = Event.findOne({
      _id: eventId,
      admin: userId,
    });
    if (!event) {
      return res.status(400).json({ message: "Invalid operation" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong " });
  }
};

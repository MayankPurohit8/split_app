import Event from "../models/eventSchema.js";
export const createEvent = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const newEvent = await Event.create({
      name: name,
      description: description,
      created_by: userId,
      admins: [userId],
      members: [{ userId }],
    });

    return res
      .status(200)
      .json({ message: "new group created", event: newEvent });
  } catch (err) {
    return res.status(500).json({ message: "Unable to make group" });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.query;
    const userId = req.user.id;
    const event = await Event.findOne({
      _id: eventId,
      "members.userId": userId,
    });

    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }

    return res.status(200).json({ event: event });
  } catch (err) {
    return res.status(500).json({ message: "event could not be fetched" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId, newName, newDescription } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "empty eventId" });
    }
    if (!newName && !newDescription) {
      return res
        .status(400)
        .json({ message: "require at least name or description" });
    }
    const event = await Event.findOneAndUpdate(
      { _id: eventId },
      {
        name: newName,
        description: newDescription,
      }
    );
    if (!event) {
      return res.status(400).json({ message: "event not found" });
    }

    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong while updating event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: "event does not exist" });
    }

    await Event.deleteOne({ _id: eventId });

    return res.status(200).json({ message: "event deleted successfully " });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while deleting event" });
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ "members.userId": userId });

    return res.status(200).json({ events: events });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while retrieving events" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;

    const event = await Event.updateOne(
      { _id: eventId },
      { $addToSet: { members: { userId: memberId } } }
    );

    return res.status(200).json({ message: "member added to group" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while adding member " });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;

    const event = await Event.updateOne(
      { _id: eventId },
      {
        $pull: {
          members: { userId: memberId },
          admins: memberId,
        },
      }
    );

    return res.status(200).json({ message: "member removed from group" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while removing member " });
  }
};

export const assignAdmin = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;

    const findMember = await Event.findOne({
      _id: eventId,
      "members.userId": memberId,
    });
    if (!findMember) {
      return res
        .status(400)
        .json({ message: "non members cannot be assigned admin" });
    }
    const event = await Event.findOneAndUpdate(
      { _id: eventId },
      { $addToSet: { admins: memberId } }
    );
    return res.status(200).json({ message: "member added to admin" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "something went wrong while making admin " });
  }
};

export const revokeAdmin = async (req, res) => {
  try {
    const { eventId, memberId } = req.body;

    const findMember = await Event.findOne({ _id: eventId, admins: memberId });
    if (!findMember) {
      return res.status(400).json({ message: "admin not found" });
    }
    const event = await Event.findOneAndUpdate(
      { _id: eventId },
      { $pull: { admins: memberId } }
    );

    return res.status(200).json({ message: "admin demoted to member" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while making admin " });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const memberId = req.user.id;

    const event = await Event.findOneAndUpdate(
      { _id: eventId },
      { $pull: { members: { userId: memberId }, admins: memberId } },
      { new: true }
    );
    if (!event) {
      return res.status(400).json({ message: "not a member" });
    }
    if (event.admins.length == 0 && event.members.length == 0) {
      await Event.deleteOne({
        _id: eventId,
      });
    } else if (event.admins.length === 0 && event.members.length > 0) {
      const oldestMember = event.members.sort(
        (a, b) => a.addedAt - b.addedAt
      )[0];

      await Event.updateOne(
        { _id: eventId },
        { $addToSet: { admins: oldestMember.userId } }
      );
    }
    return res.status(200).json({ message: "admin demoted to member" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong while making admin " });
  }
};

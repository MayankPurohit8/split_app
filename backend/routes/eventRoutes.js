import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllEvent,
  removeMember,
  assignAdmin,
  revokeAdmin,
  leaveEvent,
  getEventBalance,
  simplifyBalance,
  addMembers,
} from "../controllers/eventController.js";
import { getEventNotifications } from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import express from "express";
const router = express.Router();

router.post("/create", verifyToken, createEvent);
router.get("/get", verifyToken, getEvent);
router.post("/update", verifyToken, checkAdmin, updateEvent);
router.post("/delete", verifyToken, checkAdmin, deleteEvent);
router.get("/all", verifyToken, getAllEvent);
router.post("/member/add", verifyToken, checkAdmin, addMembers);
router.post("/member/remove", verifyToken, checkAdmin, removeMember);
router.post("/member/promote", verifyToken, checkAdmin, assignAdmin);
router.post("/member/demote", verifyToken, checkAdmin, revokeAdmin);
router.post("/leave", verifyToken, leaveEvent);
router.get("/balance/get", verifyToken, getEventBalance);
router.get("/balance/simplify", verifyToken, simplifyBalance);
router.get("/notifications", verifyToken, getEventNotifications);
export default router;

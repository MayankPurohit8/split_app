import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getAllEvent,
  addMember,
  removeMember,
  assignAdmin,
  revokeAdmin,
  leaveEvent,
} from "../controllers/eventController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import express from "express";
const router = express.Router();

router.post("/create", verifyToken, createEvent);
router.get("/get", verifyToken, getEvent);
router.post("/update", verifyToken, checkAdmin, updateEvent);
router.post("/delete", verifyToken, checkAdmin, deleteEvent);
router.get("/all", verifyToken, getAllEvent);
router.post("/member/add", verifyToken, checkAdmin, addMember);
router.post("/member/remove", verifyToken, checkAdmin, removeMember);
router.post("/member/promote", verifyToken, checkAdmin, assignAdmin);
router.post("/member/demote", verifyToken, checkAdmin, revokeAdmin);
router.post("/leave", verifyToken, leaveEvent);

export default router;

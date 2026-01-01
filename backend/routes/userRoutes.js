import {
  getUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendsList,
  getRequests,
  getUserbalance,
  getFriendBalanceAndExpenses,
} from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.post("/friends/send", verifyToken, sendFriendRequest);
router.post("/friends/accept", verifyToken, acceptFriendRequest);
router.post("/friends/reject", verifyToken, rejectFriendRequest);
router.delete("/friends/remove", verifyToken, removeFriend);
router.get("/friends", verifyToken, getFriendsList);
router.get("/requests", verifyToken, getRequests);
router.get("/getBalance", verifyToken, getUserbalance);
router.get("/friend/balance", verifyToken, getFriendBalanceAndExpenses);
export default router;

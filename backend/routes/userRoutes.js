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
  editProfile,
  searchUsers,
  getPeopleProfile,
  sendRemainder,
} from "../controllers/userController.js";
import { getUserNotifications } from "../controllers/notificationController.js";
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
import {} from "../controllers/notificationController.js";

router.get("/profile", verifyToken, getUserProfile);
router.post("/profile/edit", verifyToken, editProfile);
router.post("/friends/send", verifyToken, sendFriendRequest);
router.post("/friends/accept", verifyToken, acceptFriendRequest);
router.post("/friends/reject", verifyToken, rejectFriendRequest);
router.delete("/friends/remove", verifyToken, removeFriend);
router.get("/friends", verifyToken, getFriendsList);
router.get("/requests", verifyToken, getRequests);
router.get("/getBalance", verifyToken, getUserbalance);
router.get("/friend/balance", verifyToken, getFriendBalanceAndExpenses);
router.get("/notifications", verifyToken, getUserNotifications);
router.post("/search", verifyToken, searchUsers);
router.get("/people/profile", verifyToken, getPeopleProfile);
router.post("/alert", verifyToken, sendRemainder);

export default router;

import {
  createSettlement,
  acceptSettlement,
  declineSettlement,
  getSettlementHistory,
  getEventSettlementHistory,
  getSettlement,
} from "../controllers/settlementController.js";
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create", verifyToken, createSettlement);
router.post("/accept", verifyToken, acceptSettlement);
router.post("/decline", verifyToken, declineSettlement);
router.get("/get/user", verifyToken, getSettlementHistory);
router.get("/get/event", verifyToken, getEventSettlementHistory);
router.get("/get", verifyToken, getSettlement);

export default router;

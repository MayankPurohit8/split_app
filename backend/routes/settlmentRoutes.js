import {
  createSettlement,
  acceptSettlement,
  declineSettlement,
  getSettlementHistory,
  getEventSettlementHistory,
} from "../controllers/settlementController.js";
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create", verifyToken, createSettlement);
router.post("/accept", verifyToken, acceptSettlement);
router.post("/decline", verifyToken, declineSettlement);
router.get("/user", verifyToken, getSettlementHistory);
router.get("/event", verifyToken, getEventSettlementHistory);

export default router;

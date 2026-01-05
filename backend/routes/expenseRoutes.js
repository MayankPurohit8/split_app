import {
  createExpense,
  updateExpense,
  deleteExpense,
  getEventExpenses,
  getExpense,
  getUserExpenses,
} from "../controllers/expenseController.js";
import {
  expenseModification,
  expenseRetrival,
} from "../middlewares/expensePermission.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import express from "express";
const router = express.Router();

router.post("/create", verifyToken, createExpense);
router.post("/update", verifyToken, expenseModification, updateExpense);
router.post("/delete", verifyToken, expenseModification, deleteExpense);
router.get("/get", verifyToken, expenseRetrival, getExpense);
router.get("/get/event", verifyToken, getEventExpenses);
router.get("/get/user", verifyToken, getUserExpenses);

export default router;

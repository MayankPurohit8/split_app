import {
  register,
  login,
  logout,
  checkUsername,
  checkEmail,
} from "../controllers/authController.js";
import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/checkusername", checkUsername);
router.post("/checkemail", checkEmail);
export default router;

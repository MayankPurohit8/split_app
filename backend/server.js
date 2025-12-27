import express from "express";
import conn from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
dotenv.config();
const port = 3000;
app.use(cookieParser());
app.use(cors());
conn();
app.get("/", (req, res) => {
  res.send("hello index");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(port);

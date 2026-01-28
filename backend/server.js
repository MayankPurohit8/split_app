import express from "express";
import conn from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import settlementRoutes from "./routes/settlmentRoutes.js";
//dotenv.config();
await conn();
const app = express();
app.use(express.json());

const port = 3000;
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173/", "http://192.168.1.5:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello index");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/settle", settlementRoutes);
app.listen(port, "0.0.0.0");

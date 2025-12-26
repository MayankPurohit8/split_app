import express from "express";
import conn from "./database/db.js";
import User from "./database/userSchema.js";
const app = express();
const port = 3000;

conn();
app.get("/", (req, res) => {
  res.send("hello index");
});

app.listen(port);

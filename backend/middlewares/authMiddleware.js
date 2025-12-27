import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    req.user = {
      id: decoded.userId,
      name: decoded.userName,
    };
    next();
  } catch (err) {
    console.log(err);
    console.log("invalid or expired token");
  }
};

export { verifyToken };

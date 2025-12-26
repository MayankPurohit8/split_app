import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.AUTH_SECRET);
  } catch (err) {
    console.log(err);
    console.log("invalid token");
  }
};

export default { verifyToken };

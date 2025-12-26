import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { email, name, phone, password, username } = req.body;
    if (!email || !name || !phone || !password || !username) {
      return res.status(400).json({ message: "One or more empty fields" });
    }
    const existingEmail = await User.findOne({ email: email });
    const existingPhone = await User.findOne({ phone: phone });
    const existingUsername = await User.findOne({ userName: username });

    if (existingEmail) {
      return res.status(400).json({ message: "User with same email exists" });
    }
    if (existingPhone) {
      return res.status(400).json({ message: "User with same phone exists" });
    }
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "User with same username exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      name: name,
      phone: phone,
      password: hash,
      userName: username,
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "something went wrong while registering the user" });
  }
};
export const login = async (req, res) => {
  try {
    const { emailorusername, password } = req.body;
    if (!emailorusername || !password) {
      return res.status(400).json({ message: "One or more empty fields!" });
    }
    const user = await User.findOne({
      $or: [{ email: emailorusername }, { userName: emailorusername }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.name },
      process.env.AUTH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "User logged in" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong while logging in user" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while logging out",
    });
  }
};

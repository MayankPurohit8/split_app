import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { email, name, avatar, password, username } = req.body;
    if (!email || !name || !password || !username || !avatar) {
      return res.status(400).json({ message: "One or more empty fields" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password should be more than equal 8 characters" });
    }
    const existingEmail = await User.findOne({ email: email });
    const existingUsername = await User.findOne({ userName: username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "username exists already" });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      name: name,
      password: hash,
      userName: username,
      avatar: avatar,
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
4;
export const login = async (req, res) => {
  try {
    const existingToken = req.cookies?.token;
    if (existingToken) {
      const decoded = jwt.verify(existingToken, process.env.AUTH_SECRET);
      if (decoded) {
        return res.status(400).json({ message: "already logged in" });
      }
    }
    console.log(existingToken);
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
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    console.log(user._id);
    return res
      .status(200)
      .json({ message: "User logged in", userId: user._id });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while logging in user" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
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

export const checkUsername = async (req, res) => {
  const { username } = req.body;

  const exists = await User.exists({ userName: username });

  return res.status(200).json({
    avaliable: !exists,
  });
};

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.exists({ email: email });

    return res.status(200).json({
      avaliable: !exists,
    });
  } catch (err) {
    console.log(err);
  }
};

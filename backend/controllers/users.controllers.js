import Profile from "../models/profile.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const userActiveCheck = async (re, res) => {
  return res.status(200).json({ message: "User Route's Working Perfectly" });
};

// Controller for new User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.status(201).json({ message: "User created sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login Controller for already Exxisting User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are reuired" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");

    await user.updateOne({ _id: user._id }, { token });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

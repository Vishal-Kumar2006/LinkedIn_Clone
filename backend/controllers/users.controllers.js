import Profile from "../models/profile.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import Connection from "../models/connections.models.js";

// A Function to convert User Data into PDF Page
const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const fullPath = `uploads/${outputPath}`;

  // Ensure uploads folder exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  const stream = fs.createWriteStream(fullPath);
  doc.pipe(stream);

  // Add profile image if it exists
  if (userData.userId.profilePicture) {
    try {
      doc.image(`uploads/${userData.userId.profilePicture}`, {
        align: "center",
        width: 100,
      });
      doc.moveDown(8);
    } catch (err) {
      console.log("⚠️ Error loading image:", err.message);
    }
  }

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.userName}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  if (userData.pastWork && userData.pastWork.length > 0) {
    doc.moveDown().fontSize(18).text("Past Work:");
    userData.pastWork.forEach((work) => {
      doc.fontSize(14).text(`Company: ${work.company}`);
      doc.text(`Position: ${work.position}`);
      doc.text(`Experience: ${work.years} years`);
      doc.moveDown();
    });
  }

  doc.end();

  // Return after writing finishes
  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(fullPath));
    stream.on("error", reject);
  });
};

//  TO Check if the user Routes are active
export const userActiveCheck = async (re, res) => {
  return res.status(200).json({ message: "User Route's Working Perfectly" });
};

// Controller for new User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;

    if (!name || !email || !password || !userName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userName,
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

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { token },
      { new: true } // returns the updated document
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To Upload the profile picture
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res
      .status(201)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To Updadte the profile picture of user
export const updateUserProfile = async (req, res) => {
  console.log(req.body);
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { userName, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exist" });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.status(201).json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To Get user Profile that Have Logged In
export const getUserProfile = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not Found" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email userName profilePicture"
    );

    return res.status(200).json({ userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To Upadte User's Profile Data
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile fields
    Object.assign(profile, newProfileData);
    await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: error.message });
  }
};

// To get all user exist in db
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email userName profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To download the resume of A user
export const downloadProfile = async (req, res) => {
  try {
    const userId = req.query.id;

    const userProfile = await Profile.findOne({ userId: userId }).populate(
      "userId",
      "name userName email profilePicture"
    );

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To create a connection Requset between User's
export const sendConnectionRequest = async (req, res) => {
  try {
    const { token, connectionId } = req.body;

    const user = await User.findOne({ token: token });
    const connection = await User.findOne({ _id: connectionId });
    if (!user || !connection) {
      return res.status(404).json({ message: "User not found" });
    }

    const exitingRequest = await Connection.findOne({
      userId: user._id,
      connectionId: connectionId,
    });

    if (exitingRequest) {
      return res.status(400).json({ message: "Request already exist" });
    }

    const newConnection = new Connection({
      userId: user._id,
      connectionId: connectionId,
    });

    await newConnection.save();

    return res.status(201).json({ message: "Request Send" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To create a connection Requset between User's
export const getMyConnectionRequests = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await Connection.find({ userId: user._id }).populate(
      "connectionId",
      "name userName email profilePicture"
    );

    return res.status(201).json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To Know the data of What are my Connections
export const whatAreMyConnections = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await Connection.find({
      connectionId: user._id,
    }).populate("connectionId", "name userName email profilePicture");
    return res.status(201).json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To Accept or Reject the Connection Request
export const acceptConnectonRequest = async (req, res) => {
  try {
    const { token, requestId, actionType } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await Connection.findOne({ userId: requestId });

    if (!connection) {
      return res.status(401).json({ message: "Connection not Found" });
    }

    if (actionType === "accept") {
      connection.statusAccepted = true;
    } else {
      connection.statusAccepted = false;
    }

    await connection.save();
    return res.status(200).json({ message: "Request updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import mongoose from "mongoose";

const userSchem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  token: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchem);

export default User;

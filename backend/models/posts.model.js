import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    reuired: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  media: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  fileType: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;

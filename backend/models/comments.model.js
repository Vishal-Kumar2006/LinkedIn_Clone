import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  body: {
    type: String,
    default: "",
  },
  likes: {
    type: Number,
    default: 0,
  },
  replies: {
    type: Array,
    default: [],
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

import mongoose from "mongoose";
import { ref } from "pdfkit";

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
  likes: {},
  replies: {},
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

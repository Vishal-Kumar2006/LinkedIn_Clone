import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running Perfectly" });
};

// To create a new Post
export const createPost = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    return res.status(201).json({ message: "Post created Sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To get all post's
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name userName emil profilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.error });
  }
};

// To delete a Specific post
export const deletePost = async (req, res) => {
  try {
    const { token, postId } = req.body;
    if (!token || !postId) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.json(404).json({ message: "User not Found" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.json(404).json({ message: "Post not Found" });
    }

    if (post.userId.toString() != user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    post.deleteOne({ _id: postId });

    return res.json({ message: "Post Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To create a new comment on a Post
export const commentPost = async (req, res) => {
  try {
    const { token, postId, commentBody } = req.body;

    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: postId,
      body: commentBody,
    });

    await comment.save();
    post.comments.push(comment._id);

    await post.save();

    return res.status(201).json({ message: "Comment created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To get all comment's of a specific post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// To delete a specific comment of a user on a post
export const deleteCommentOfUser = async (req, res) => {
  try {
    const { token, commentId, postId } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json("User not Found");
    }

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "comment not Found" });
    }

    if (comment.userId.toString() != user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    post.comments = post.comments.filter(
      (id) => id.toString() !== commentId.toString()
    );
    await post.save();

    await Comment.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Updte like of post (increase or decrease)
export const updateLike = async (req, res) => {
  try {
    const { token, postId, type } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json("Post not Found");
    }

    if (type === "increment") post.likes = post.likes + 1;
    else post.likes = post.likes - 1;

    await post.save();
    return res.status(200).json({ message: "Like updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//

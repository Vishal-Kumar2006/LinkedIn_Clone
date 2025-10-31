import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  deleteCommentOfUser,
  deletePost,
  getAllPosts,
  getCommentsByPost,
  updateLike,
} from "../controllers/posts.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, res, cb) => {
    cb(null, file.originalname);
  },
});

const uplaod = multer({ storage: storage });

router.route("/").get(activeCheck);
router.route("/post").post(uplaod.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").post(deletePost);
router.route("/comment_post").post(commentPost);
router.route("/get_comment_by_post").get(getCommentsByPost);
router.route("/delete_comment_of_user").post(deleteCommentOfUser);
router.route("/update_like").post(updateLike);

export default router;

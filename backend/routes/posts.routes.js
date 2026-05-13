import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  deleteCommentOfUser,
  deletePost,
  getAllPosts,
  incrementPostLike,
  getCommentsByPost,
  updateLike,
} from "../controllers/posts.controller.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/").get(activeCheck);

router.route("/comment_post").post(commentPost);
router.route("/delete_post").delete(deletePost);
router.route("/delete_comment_of_user").post(deleteCommentOfUser);

router.route("/get_All_Comments").get(getCommentsByPost);
router.route("/increment_post_like").post(incrementPostLike);

router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/update_like").post(updateLike);

export default router;

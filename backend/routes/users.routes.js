import { Router } from "express";
import multer from "multer";
import {
  userActiveCheck,
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
} from "../controllers/users.controllers.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(uploads.single("profile_picture"), uploadProfilePicture);

router.route("/").get(userActiveCheck);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);

export default router;

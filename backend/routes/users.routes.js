import { Router } from "express";
import multer from "multer";
import {
  userActiveCheck,
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequests,
  whatAreMyConnections,
  acceptConnectonRequest,
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
router.route("/get_user_and_profile").get(getUserProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").get(getAllUserProfile);
router.route("/download_resume").get(downloadProfile);
router.route("/connection_request").post(sendConnectionRequest);
router.route("/get_connection_requests").get(getMyConnectionRequests);
router.route("/user_connection_request").get(whatAreMyConnections);
router.route("/accept_connection_request").post(acceptConnectonRequest);

export default router;

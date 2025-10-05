import { Router } from "express";
import {
  userActiveCheck,
  register,
  login,
} from "../controllers/users.controllers.js";

const router = Router();

router.route("/").get(userActiveCheck);

router.route("/register").post(register);

router.route("/login").post(login);

export default router;

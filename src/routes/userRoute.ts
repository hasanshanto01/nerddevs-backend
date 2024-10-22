import { Router } from "express";
import {
  activateUser,
  loginUser,
  registerUser,
} from "../controllers/userController";

const router = Router();

router.route("/register").post(registerUser);
router.route("/activation").get(activateUser);
router.route("/login").post(loginUser);

export default router;

import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

export default router;

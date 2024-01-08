import express from "express";
import { authController } from "../controllers";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify_account", authController.accountVerification);
router.post("/signin", authController.signin);
router.post("/generate_access_token", authController.generateAccessToken);

export default router;

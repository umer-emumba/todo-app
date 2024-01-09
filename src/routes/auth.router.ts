import express from "express";
import { authController } from "../controllers";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify_account", authController.accountVerification);
router.post("/signin", authController.signin);
router.post("/generate_access_token", authController.generateAccessToken);
router.patch("/forgot_password/:email", authController.forgotPassword);
router.post("/reset_password", authController.resetPassword);
router.post("/social_login", authController.socialLogin);

export default router;

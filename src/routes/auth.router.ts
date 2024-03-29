import express from "express";
import { authController } from "../controllers";
import { jwtAuth } from "../middleware";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify_account", authController.accountVerification);
router.post("/signin", authController.signin);
router.post("/generate_access_token", authController.generateAccessToken);
router.patch("/forgot_password/:email", authController.forgotPassword);
router.post("/reset_password", authController.resetPassword);
router.post("/social_login", authController.socialLogin);
router.get("/user_setting", jwtAuth, authController.getUserSetting);
router.put("/user_setting", jwtAuth, authController.updateUserSetting);
router.get("/profile", jwtAuth, authController.getProfile);
router.put("/update_profile", jwtAuth, authController.updateProfile);

export default router;

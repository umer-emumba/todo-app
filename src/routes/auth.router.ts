import express from "express";
import { authController } from "../controllers";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify_account", authController.accountVerification);

export default router;

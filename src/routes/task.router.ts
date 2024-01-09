import express from "express";
import { taskController } from "../controllers";
import { jwtAuth } from "../middleware";
import multerUpload from "../utils/multer.config";
const router = express.Router();

router.post(
  "/",
  jwtAuth,
  multerUpload.array("attachments", 5),
  taskController.addTask
);
export default router;

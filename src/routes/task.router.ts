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
router.get("/", jwtAuth, taskController.getTasks);
router.put("/:id", jwtAuth, taskController.updateTask);
router.patch("/:id/completed", jwtAuth, taskController.markTaskCompleted);
router.get("/:id", jwtAuth, taskController.getTaskDetails);
router.delete("/:id", jwtAuth, taskController.deleteTask);
export default router;

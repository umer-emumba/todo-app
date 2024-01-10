import express from "express";
import { jwtAuth } from "../middleware";
import { reportController } from "../controllers";

const router = express.Router();

router.get("/tasks_count", jwtAuth, reportController.getTasksCount);
router.get(
  "/daily_task_avg",
  jwtAuth,
  reportController.averageCompletedTasksPerDay
);
router.get("/over_due_tasks", jwtAuth, reportController.getOverDueTasksCount);

export default router;

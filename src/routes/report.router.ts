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
router.get(
  "/max_task_completion_date",
  jwtAuth,
  reportController.getMaxTaskCompletionDate
);
router.get(
  "/tasks_creation_by_weekday",
  jwtAuth,
  reportController.getTasksCreationByDayCount
);

export default router;

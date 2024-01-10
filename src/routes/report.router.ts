import express from "express";
import { jwtAuth } from "../middleware";
import { reportController } from "../controllers";

const router = express.Router();

router.get("/tasks_count", jwtAuth, reportController.getTasksCount);

export default router;

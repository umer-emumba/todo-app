import { Request, Response } from "express";
import { reportService } from "../services";
import { sendSuccessResponse } from "../utils";

class ReportController {
  async getTasksCount(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = await reportService.getTasksCount(user.id);
    return sendSuccessResponse(res, 200, data);
  }

  async averageCompletedTasksPerDay(
    req: Request,
    res: Response
  ): Promise<void> {
    const user = req.user;
    const data = await reportService.averageCompletedTasksPerDay(user.id);
    return sendSuccessResponse(res, 200, data);
  }

  async getOverDueTasksCount(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = await reportService.getOverDueTasksCount(user.id);
    return sendSuccessResponse(res, 200, data);
  }

  async getMaxTaskCompletionDate(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = await reportService.getMaxTaskCompletionDate(user.id);
    return sendSuccessResponse(res, 200, data);
  }
}

export default new ReportController();

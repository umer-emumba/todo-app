import { Request, Response } from "express";
import { reportService } from "../services";
import { sendSuccessResponse } from "../utils";

class ReportController {
  async getTasksCount(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const data = await reportService.getTasksCount(user.id);
    return sendSuccessResponse(res, 200, data);
  }
}

export default new ReportController();

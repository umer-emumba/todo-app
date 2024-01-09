import { Request, Response } from "express";
import { extractFileTypeFromMime, sendSuccessResponse } from "../utils";
import { CreateTaskDto } from "../interfaces";
import { plainToClass } from "class-transformer";
import { taskService } from "../services";

class TaskController {
  async addTask(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const dto: CreateTaskDto = plainToClass(CreateTaskDto, req.body);
    dto.task_attachments = (req.files as Express.Multer.File[]).map((file) => ({
      attachment_url: `uploads/${file.filename}`,
      attachment_type: extractFileTypeFromMime(file.mimetype),
    }));

    const message = await taskService.addTask(user.id, dto);
    return sendSuccessResponse(res, 201, { message });
  }
}
export default new TaskController();

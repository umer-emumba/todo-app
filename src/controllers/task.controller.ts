import { Request, Response } from "express";
import {
  createAndValidateDto,
  extractFileTypeFromMime,
  sendSuccessResponse,
} from "../utils";
import { CreateTaskDto, PaginationDto, UpdateTaskDto } from "../interfaces";

import { taskService } from "../services";

class TaskController {
  async addTask(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const dto: CreateTaskDto = await createAndValidateDto(
      CreateTaskDto,
      req.body
    );
    dto.task_attachments = (req.files as Express.Multer.File[]).map((file) => ({
      attachment_url: `uploads/${file.filename}`,
      attachment_type: extractFileTypeFromMime(file.mimetype),
    }));

    const message = await taskService.addTask(user, dto);
    return sendSuccessResponse(res, 201, { message });
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { id } = req.params;
    const dto: UpdateTaskDto = await createAndValidateDto(
      UpdateTaskDto,
      req.body
    );

    const message = await taskService.updateTask(user.id, Number(id), dto);
    return sendSuccessResponse(res, 200, { message });
  }

  async markTaskCompleted(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { id } = req.params;

    const message = await taskService.markTaskCompleted(user.id, Number(id));
    return sendSuccessResponse(res, 200, { message });
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const dto: PaginationDto = await createAndValidateDto(
      PaginationDto,
      req.query
    );
    const tasks = await taskService.getTasks(user.id, dto);

    return sendSuccessResponse(res, 200, tasks);
  }

  async getTaskDetails(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { id } = req.params;
    const task = await taskService.getTaskDetails(user.id, Number(id));
    return sendSuccessResponse(res, 200, task);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { id } = req.params;
    const message = await taskService.deleteTask(user.id, Number(id));
    return sendSuccessResponse(res, 200, { message });
  }

  async getSimilarTasks(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const { id } = req.params;
    const tasks = await taskService.getSimilarTasks(user.id, Number(id));
    return sendSuccessResponse(res, 200, tasks);
  }
}
export default new TaskController();

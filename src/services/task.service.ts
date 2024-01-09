import { CreateTaskDto } from "../interfaces";
import { taskRepository } from "../repositories";
import {
  BadRequestError,
  CREATED_SUCCESSFULLY,
  TASK_LIMIT_EXCEEDED,
  config,
} from "../utils";

class TaskService {
  async addTask(userId: number, dto: CreateTaskDto): Promise<string> {
    const taskCount = await taskRepository.count(userId);
    if (taskCount >= config.maxTaskCount) {
      throw new BadRequestError(TASK_LIMIT_EXCEEDED);
    }
    await taskRepository.create(userId, dto);
    return CREATED_SUCCESSFULLY("Task");
  }
}
export default new TaskService();

import {
  CreateTaskDto,
  IPaginatedResponse,
  PaginationDto,
  TaskType,
  UpdateTaskDto,
} from "../interfaces";
import { Task, TaskAttachment } from "../models";
import { taskRepository } from "../repositories";
import {
  BadRequestError,
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  NOT_FOUND_ERROR,
  TASK_ALREADY_COMPLETED,
  TASK_LIMIT_EXCEEDED,
  UPDATED_SUCCESSFULLY,
  config,
  createAndSaveTemplate,
} from "../utils";

class TaskService {
  async addTask(userId: number, dto: CreateTaskDto): Promise<string> {
    const taskCount = await taskRepository.countById(userId);
    if (taskCount >= config.maxTaskCount) {
      throw new BadRequestError(TASK_LIMIT_EXCEEDED);
    }

    let templateUrl: string = "";

    if (dto.task_type === TaskType.HTML) {
      templateUrl = await createAndSaveTemplate(dto.html);
    }

    await taskRepository.create(
      { ...dto, user_id: userId, template_url: templateUrl },
      { include: [{ model: TaskAttachment }] }
    );
    return CREATED_SUCCESSFULLY("Task");
  }

  async updateTask(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto
  ): Promise<string> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    if (task.user_id !== userId) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }

    let templateUrl: string = "";

    if (dto.task_type === TaskType.HTML) {
      templateUrl = await createAndSaveTemplate(dto.html);
    }

    await taskRepository.update(
      {
        id: taskId,
      },
      { ...dto, template_url: templateUrl }
    );
    return UPDATED_SUCCESSFULLY("Task");
  }

  async markTaskCompleted(userId: number, taskId: number): Promise<string> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    if (task.user_id !== userId) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    if (task.is_completed === 1) {
      throw new BadRequestError(TASK_ALREADY_COMPLETED);
    }

    await taskRepository.markCompleted(taskId);
    return UPDATED_SUCCESSFULLY("Task");
  }

  async getTasks(
    userId: number,
    dto: PaginationDto
  ): Promise<IPaginatedResponse<Task>> {
    const [count, rows] = await Promise.all([
      await taskRepository.count(userId, dto),
      await taskRepository.findAll(userId, dto),
    ]);
    return { count, rows };
  }

  async getTaskDetails(userId: number, taskId: number): Promise<Task | null> {
    const task = await taskRepository.getTaskDetails(taskId);
    if (!task) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    if (task.user_id !== userId) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    return task;
  }

  async deleteTask(userId: number, taskId: number): Promise<string> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    if (task.user_id !== userId) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    await taskRepository.delete({ id: taskId });
    return DELETED_SUCCESSFULLY("Task");
  }

  async getSimilarTasks(userId: number, taskId: number): Promise<Task[]> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    if (task.user_id !== userId) {
      throw new BadRequestError(NOT_FOUND_ERROR("Task"));
    }
    const tasks = await taskRepository.findSimilarTasks(task);
    return tasks;
  }
}
export default new TaskService();

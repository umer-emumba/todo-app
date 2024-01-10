import {
  IAverageTaskCompleted,
  IMaxTaskCompletionDate,
  IOverDueTaskCount,
  ITaskCount,
} from "../interfaces";
import { taskRepository } from "../repositories";

class ReportService {
  async getTasksCount(userId: number): Promise<ITaskCount> {
    return taskRepository.getTasksCount(userId);
  }

  async averageCompletedTasksPerDay(
    userId: number
  ): Promise<IAverageTaskCompleted> {
    return taskRepository.averageCompletedTasksPerDay(userId);
  }

  async getOverDueTasksCount(userId: number): Promise<IOverDueTaskCount> {
    return taskRepository.getOverDueTasksCount(userId);
  }

  async getMaxTaskCompletionDate(
    userId: number
  ): Promise<IMaxTaskCompletionDate> {
    return taskRepository.getMaxTaskCompletionDate(userId);
  }
}

export default new ReportService();

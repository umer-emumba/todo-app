import {
  IAverageTaskCompleted,
  IMaxTaskCompletionDate,
  IOverDueTaskCount,
  ITaskCount,
  ITasksPerDay,
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

  async getTasksCreationByDayCount(userId: number): Promise<ITasksPerDay[]> {
    return taskRepository.getTasksCreationByDayCount(userId);
  }
}

export default new ReportService();

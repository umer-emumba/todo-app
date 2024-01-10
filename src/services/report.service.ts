import { ITaskCount } from "../interfaces";
import { taskRepository } from "../repositories";

class ReportService {
  async getTasksCount(userId: number): Promise<ITaskCount> {
    return taskRepository.getTasksCount(userId);
  }
}

export default new ReportService();

import cron from "node-cron";
import { REMINDER_EMAIL_BODY, REMINDER_EMAIL_TITLE, logger } from "../utils";
import { taskRepository } from "../repositories";
import QueueService from "./queue.service";
import { QueuesEnum, IMailOptions, JobTypeEnum } from "../interfaces";
class CronService {
  async sendEmailReminders(): Promise<void> {
    //cron will run daily 12am
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("cron started");
        const todayTasks = await taskRepository.getTodayTasks();

        const instance = new QueueService();
        const queue = instance.getQueue(QueuesEnum.DEFAULT);

        todayTasks.forEach((task) => {
          const mailOptions: IMailOptions = {
            to: task.user.email,
            subject: REMINDER_EMAIL_TITLE,
            html: REMINDER_EMAIL_BODY(task.title),
          };
          queue.add(JobTypeEnum.SEND_EMAIL, mailOptions);
        });
      } catch (error) {
        logger.error(error);
      }
    });
  }
}

export default new CronService();

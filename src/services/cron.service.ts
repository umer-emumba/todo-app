import cron from "node-cron";
import {
  REMINDER_EMAIL_BODY,
  REMINDER_EMAIL_TITLE,
  createShortUrl,
  logger,
} from "../utils";
import { taskRepository, userRepository } from "../repositories";
import QueueService from "./queue.service";
import {
  QueuesEnum,
  IMailOptions,
  JobTypeEnum,
  ISMSOptions,
  TaskType,
} from "../interfaces";
import { Task, User } from "../models";
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

  async sendSMSNotifications(): Promise<void> {
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("sms cron job");
        const batchSize = 20; // Process 20 users at a time

        let offset = 0;
        let users = [];
        const instance = new QueueService();
        const queue = instance.getQueue(QueuesEnum.DEFAULT);

        //batch processing
        do {
          users = await userRepository.getUsersWithTasksForNotifications(
            batchSize,
            offset
          );

          for (let user of users) {
            const userSettings = user.user_setting;

            let pendingTextTasks = user.tasks.filter(
              (task) => task.task_type === "TEXT" && task.is_completed === 0
            );
            let completedTextTasks = user.tasks.filter(
              (task) => task.task_type === "TEXT" && task.is_completed === 1
            );
            let pendingHtmlTasks = user.tasks.filter(
              (task) => task.task_type === "HTML" && task.is_completed === 0
            );
            let completedHtmlTasks = user.tasks.filter(
              (task) => task.task_type === "HTML" && task.is_completed === 1
            );

            if (pendingTextTasks.length > 0) {
              const smsOptions = await this.prepareTaskSMS(
                userSettings.pending_task_title,
                user.phone,
                TaskType.TEXT,
                pendingTextTasks
              );
              queue.add(JobTypeEnum.SEND_SMS, smsOptions);
            }
            if (completedTextTasks.length > 0) {
              const smsOptions = await this.prepareTaskSMS(
                userSettings.completed_task_title,
                user.phone,
                TaskType.TEXT,
                completedTextTasks
              );
              queue.add(JobTypeEnum.SEND_SMS, smsOptions);
            }
            if (pendingHtmlTasks.length > 0) {
              const smsOptions = await this.prepareTaskSMS(
                userSettings.pending_task_title,
                user.phone,
                TaskType.HTML,
                pendingHtmlTasks
              );
              queue.add(JobTypeEnum.SEND_SMS, smsOptions);
            }
            if (completedHtmlTasks.length > 0) {
              const smsOptions = await this.prepareTaskSMS(
                userSettings.completed_task_title,
                user.phone,
                TaskType.HTML,
                completedHtmlTasks
              );
              queue.add(JobTypeEnum.SEND_SMS, smsOptions);
            }
          }

          offset += batchSize;
        } while (users.length > 0);
      } catch (error) {
        logger.error(error);
      }
    });
  }

  private async prepareTaskSMS(
    title: string,
    phone: string,
    taskType: string,
    tasks: Task[]
  ): Promise<ISMSOptions> {
    if (taskType === "HTML") {
      const shortUrls = await this.prepareShortLinks(
        tasks.map((task) => `http://localhost:3000${task.template_url}`)
      );

      return {
        body: `${title}:
        You can visit below links to check tasks templates
        ${shortUrls.join("\n")}`,
        to: phone,
      };
    } else {
      return {
        body: `${title}:
        ${tasks.map((task) => task.title).join("\n")}`,
        to: phone,
      };
    }
  }

  private async prepareShortLinks(urls: string[]): Promise<string[]> {
    return Promise.all(urls.map((url) => createShortUrl(url)));
  }
}

export default new CronService();
